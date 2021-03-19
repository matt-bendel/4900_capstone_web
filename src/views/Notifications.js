import React from "react";
import {Link} from "react-router-dom";
import {Button, Card, CardBody, CardFooter, Col, Form, FormGroup, CustomInput, Row, Label, } from "reactstrap";
import Loader from 'react-loaders'
import firebase from "firebase";
import {UserContext} from "../contexts/UserContext";

let loader = <Loader type="ball-pulse-sync" style={{textAlign: "center", alignSelf: "center"}}/>
let initialLoad = true;

function Notifications(props) {
  const [notification, setNotification] = React.useState({
    lowBattery: false,
    lowLiquid: false,
    recharge: false,
    refill: false,
    init: true
  });
  const [loading, setLoading] = React.useState(true);

  let user = React.useContext(UserContext).user;

  React.useEffect(() => {
    if (notification.init) {
      firebase.firestore().collection('notifications').doc(user.deviceId).get().then(
          (data) => {
            setNotification({
              lowBattery: data.data().lowBattery,
              lowLiquid: data.data().lowLiquid,
              recharge: data.data().recharged,
              refill: data.data().refilled,
              init: false,
            });
          }
      ).catch((e) => {
        console.log(e);
        setNotification({
          lowBattery: false,
          lowLiquid: false,
          recharge: false,
          refill: false,
          init: false,
        });
      });
    }
  });

  const update = (event, userNotif) => {
    setLoading(true);
    event.preventDefault();

    firebase.firestore().collection('notifications').doc(user.deviceId).update({
      lowBattery: notification.lowBattery,
      lowLiquid: notification.lowLiquid,
      refilled: notification.refill,
      recharged: notification.recharge,
    });
  };

  if (loading) {
    if (initialLoad) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }

    return (
        <>
          <div className="login-content" style={{display: "flex",
            justifyContent: "center",
            alignItems: "center"}}>
            {loader}
          </div>
        </>
    );
  }

  return (
      <>
        <div className="login-content" style={{display: "flex",
          justifyContent: "center",
          alignItems: "center"}}>
          <Col sm="6" md={{ size: 4 }}>
            <h1>Select which notifications you want to receive</h1>
            <h6>NOTE: Notifications are deliviered to the email associated with your account.</h6>
            <Card>
              <UserContext.Consumer>
                {({ user }) => (
                    <Form onSubmit={(e) => update(e, user)}>
                      <CardBody>
                        <Row>
                          <Col className="pl-md-1" md="12">
                            <FormGroup>
                              <h4 for="exampleCheckbox">Notification Options</h4>
                                <CustomInput type="switch" defaultChecked={notification.lowBattery} onChange={() => {
                                  let newNoti = notification;
                                  newNoti.lowBattery = !notification.lowBattery;
                                  setNotification(newNoti);
                                }} id="switch-1" label="Receive a notification when the amount of battery remaining is less than 5%." />
                                <br />
                                <CustomInput type="switch" defaultChecked={notification.lowLiquid} onChange={() => {
                                  let newNoti = notification;
                                  newNoti.lowLiquid = !notification.lowLiquid;
                                  setNotification(newNoti);
                                }} id="switch-2" label="Receive a notification when the amount of disinfectant remaining is less than 5%." />
                                <br />
                                <CustomInput type="switch" defaultChecked={notification.recharge} onChange={() => {
                                  let newNoti = notification;
                                  newNoti.recharge = !notification.recharge;
                                  setNotification(newNoti);
                                }} id="switch-3" label="Receive a notification when the battery is recharged." />
                                <br />
                                <CustomInput type="switch" defaultChecked={notification.refill} onChange={() => {
                                  let newNoti = notification;
                                  newNoti.refill = !notification.refill;
                                  setNotification(newNoti);
                                }} id="switch-4" label="Receive a notification when the disinfectant is refilled." />
                            </FormGroup>
                          </Col>
                        </Row>
                      </CardBody>
                      <CardFooter className="text-center">
                        <Button className="btn-fill" color="info" type="submit" id="submit">
                          Update
                        </Button>
                      </CardFooter>
                    </Form>)}
              </UserContext.Consumer>
            </Card>
          </Col>
        </div>
      </>
  );
}

export default Notifications;