import React from "react";
import {Button, Card, CardBody, CardFooter, Col, Form, FormFeedback, FormGroup, Input, Row} from "reactstrap";
import Loader from 'react-loaders'
import firebase from "firebase";
import NotificationAlert from "react-notification-alert";
import {UserContext} from "../contexts/UserContext";

let loader = <Loader type="ball-pulse-sync" style={{textAlign: "center", alignSelf: "center"}}/>
let initialLoad = true;

function LinkDevice(props) {
    const [code, setCode] = React.useState("");
    const [codeDone, setCodeDone] = React.useState(true);
    const [loading, setLoading] = React.useState(true);
    const notificationAlertRef = React.useRef(null);

    React.useEffect(() => {
        if (code !== "" && code.length < 29) {
            setCodeDone(false);
        } else if (code !== "" && code.length > 28){
            setCodeDone(true);
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

    const link = async (event, updateUserContext, userToUpdate) => {
        setLoading(true);
        event.preventDefault();

        if (code === "") {
            setTimeout(() => {
                setLoading(false);
                notify("Please do not leave any fields blank.");
            }, 1000);
        }

        let ref = firebase.firestore().collection('devices').doc(code);
        await ref.get().then((data) => {
            if (!data.data()) {
                setTimeout(() => {
                    setLoading(false);
                    notify("There is no device linked to the code you entered. Please try again.");
                }, 1000);

                return;
            } else {
                ref.update({
                   userEmail: userToUpdate.contactEmail
                });
            }

            updateUserContext({
                theme: userToUpdate.theme,
                companyName: userToUpdate.companyName,
                contactEmail: userToUpdate.contactEmail,
                linkedDevice: true,
                deviceId: code,
            }, true);

            firebase.firestore().collection('notifications').doc(code).set({
               lowBattery: false,
               lowLiquid: false,
               refilled: false,
               recharged: false,
               email: userToUpdate.contactEmail,
            });

            props.history.push('/dashboard');
        }).catch((e) => {
            console.log(e);
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
                <div className="react-notification-alert-container">
                    <NotificationAlert ref={notificationAlertRef} />
                </div>
                <Col sm="6" md={{ size: 4 }}>
                    <h1>Enter your device code below</h1>
                    <h6>Note: You do not have to register your device for it to be fully functional.</h6>
                    <Card>
                        <UserContext.Consumer>
                            {({ user, updateUser }) => (
                                <Form onSubmit={(e) => link(e, updateUser, user)}>
                                    <CardBody>
                                        <Row>
                                            <Col className="pl-md-1" md="12">
                                                <FormGroup>
                                                    <label>
                                                        Device Code
                                                    </label>
                                                    <Input invalid={!codeDone} placeholder={"Device code here"} value={code ? code : ""} onChange={(val) => {
                                                        setCode(val.target.value);
                                                    }}/>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                    <CardFooter className="text-center">
                                        <Button className="btn-fill" color="info" type="submit" id="submit">
                                            Link Device
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

export default LinkDevice;