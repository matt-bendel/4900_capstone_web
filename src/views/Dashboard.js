/*!

=========================================================
* Black Dashboard React v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
import firebase from "firebase";
// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";

// core components
import {
  chartExample1,
} from "variables/charts.js";
import Loader from "react-loaders";
import {UserContext} from "../contexts/UserContext";
import NotificationAlert from "react-notification-alert";
import ProgressBar from 'react-percent-bar'

let loader = <Loader type="ball-pulse-sync" style={{textAlign: "center", alignSelf: "center"}}/>
let initialLoad = true;

function Dashboard(props) {
  const [bigChartData, setbigChartData] = React.useState("data1");
  const [batteryPercent, setBatteryPercent] = React.useState("");
  const [liquidPercent, setLiquidPercent] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const notificationAlertRef = React.useRef(null);
  let user = React.useContext(UserContext).user;

  React.useEffect(() => {
    firebase.firestore().collection('devices').doc('12345').update({battery: false}).catch((e) => console.log(e));
    let deviceRef = firebase.firestore().collection('devices').doc(user.deviceId);
    const listener = deviceRef.onSnapshot((doc) => {
      if (batteryPercent !== doc.data().percentBattery && batteryPercent !== "") {
        notify("The battery percentage of your device is now " + doc.data().percentBattery + ".");
        console.log('TEST');
      }

      if (liquidPercent !== doc.data().percentLiquid && liquidPercent !== "") {
        notify("The percentage of disinfectant left in your device is " + doc.data().percentLiquid + ".");
      }

      setLiquidPercent(doc.data().percentLiquid);
      setBatteryPercent(doc.data().percentBattery);
    });

    return () => listener();
  }, []);

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

  if (loading) {
    if (initialLoad && batteryPercent !== "") {
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
      <div className="content">
        <div className="react-notification-alert-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <h1>Your device last cleaned the door handle at TEMP.</h1>
        <Row>
          <Col lg="6">
            <Card className="card-chart">
              <CardHeader>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-button-power text-info" /> Battery Life
                </CardTitle>
              </CardHeader>
              <CardBody>
                <h4>Your device is currently {batteryPercent} charged.</h4>
                <ProgressBar width={'100%'} percent={batteryPercent.replace('%','')} colorShift={true} fillColor={'red'} />
              </CardBody>
            </Card>
          </Col>
          <Col lg="6">
            <Card className="card-chart">
              <CardHeader>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-bag-16 text-info" />{" "}
                  Remaining Disinfectant
                </CardTitle>
              </CardHeader>
              <CardBody>
                <h4>There is currently {liquidPercent} of disinfectant remaining.</h4>
                <ProgressBar width={'100%'} percent={liquidPercent.replace('%','')} colorShift={true} fillColor={'red'} />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <CardTitle tag="h2">
                      <i className="tim-icons icon-chart-bar-32 text-info" />{" "}
                      Average Daily Touches
                    </CardTitle>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={chartExample1[bigChartData]}
                    options={chartExample1.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
