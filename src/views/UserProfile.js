import React from "react";
import {Link} from "react-router-dom";
import {Button, Card, CardBody, CardFooter, Col, Form, FormGroup, Input, Row, Label, FormFeedback} from "reactstrap";
import Loader from 'react-loaders'
import firebase from "firebase";
import NotificationAlert from "react-notification-alert";
import {UserContext} from "../contexts/UserContext";

let loader = <Loader type="ball-pulse-sync" style={{textAlign: "center", alignSelf: "center"}}/>
let initialLoad = true;

function CreateAccount(props) {
  const [email, setEmail] = React.useState(null);
  const [companyName, setCompanyName] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [confirmPass, setConfirmPass] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const notificationAlertRef = React.useRef(null);
  const [isValidEmail, setIsEmail] = React.useState(true);
  const [isValidPass, setIsPass] = React.useState(true);
  const [isValidPassConfirm, setIsPassConfirm] = React.useState(true);
  const [isValidCompany, setIsCompany] = React.useState(true);


  React.useEffect(() => {
    if (pass !== "" && confirmPass !== "" && confirmPass !== pass && isValidPassConfirm) {
      setIsPassConfirm(false);
    } else if (pass !== "" && confirmPass !== "" && confirmPass === pass || confirmPass === ""){
      setIsPassConfirm(true);
    }

    if (!isValidEmail && email !== "" && email) {
      setIsEmail(true);
    }

    if (!isValidPass && pass !== "") {
      setIsPass(true);
    }

    if (!isValidCompany && companyName !== "") {
      setIsCompany(true);
    }
  });

  const notify = (text) => {
    var type = "danger";
    var options = {};
    options = {
      place: "tc",
      message: (
          <div>
            <div>
              {text}
            </div>
          </div>
      ),
      type: type,
      icon: "tim-icons icon-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  }

  const update = (event, userToUpdate, updateUserContext) => {
    setLoading(true);
    event.preventDefault();

    if (companyName === ""){
      setIsCompany(false);

      setTimeout(() => {
        setLoading(false);
        notify("Please do not leave any fields blank.");
      }, 1000)

      return;
    } else {
      setIsCompany(true);
    }

    updateUserContext({
      theme: userToUpdate.theme,
      companyName: companyName,
      contactEmail: userToUpdate.contactEmail,
      linkedDevice: userToUpdate.linkedDevice,
      deviceId: userToUpdate.deviceId,
    }, true);
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
          <div className="react-notification-alert-container">
            <NotificationAlert ref={notificationAlertRef} />
          </div>
          <Col sm="6" md={{ size: 4 }}>
            <h1>Update your information below</h1>
            <Card>
              <UserContext.Consumer>
                {({ user, updateUser }) => (
                    <Form onSubmit={(e) => update(e, user, updateUser)}>
                      <CardBody>
                        <Row>
                          <Col className="pl-md-1" md="12">
                            <FormGroup>
                              <Label for="name">Company or Organization Name</Label>
                              <Input invalid={!isValidCompany} id="name" placeholder="New company name here" value={companyName !== "" ? companyName : user.companyName} onChange={(val) => {
                                setCompanyName(val.target.value);
                              }}/>
                            </FormGroup>
                          </Col>
                        </Row>
                      </CardBody>
                      <CardFooter className="text-center">
                        <Button className="btn-fill" color="info" type="submit" id="submit">
                          Update Information
                        </Button>
                      </CardFooter>
                    </Form>
                )}
              </UserContext.Consumer>
            </Card>
          </Col>
        </div>
      </>
  );
}

export default CreateAccount;