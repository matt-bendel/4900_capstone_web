import React from "react";
import {Link} from "react-router-dom";
import {Button, Card, CardBody, CardFooter, Col, Form, FormGroup, Input, Row, Label, FormFeedback} from "reactstrap";
import Loader from 'react-loaders'
import firebase from "firebase";
import NotificationAlert from "react-notification-alert";
import {UserContext} from "../contexts/UserContext";

let loader = <Loader type="ball-pulse-sync" style={{textAlign: "center", alignSelf: "center"}}/>
let initialLoad = true;

function Login(props) {
    const [email, setEmail] = React.useState(null);
    const [pass, setPass] = React.useState("");
    const [loading, setLoading] = React.useState(true);
    const notificationAlertRef = React.useRef(null);

    const notify = () => {
        var type = "danger";
        var options = {};
        options = {
            place: "tc",
            message: (
                <div>
                    <div>
                        Your account does not exist. Please create one.
                    </div>
                </div>
            ),
            type: type,
            icon: "tim-icons icon-bell-55",
            autoDismiss: 7,
        };
        notificationAlertRef.current.notificationAlert(options);
    }

    const authenticate = (event, updateUserContext) => {
        setLoading(true);
        event.preventDefault();
        firebase.auth().signInWithEmailAndPassword(email, pass).then((user) => {
            updateUserContext({
                theme: "",
                companyName: "",
                contactEmail: email,
                linkedDevice: false,
            }, false);
        }).catch((e) => {
            setTimeout(() => {
                setLoading(false);
                notify();
            }, 1000)
        })
    };

    if (loading) {
        if (initialLoad) {
            setTimeout(() => {
                setLoading(false);
            }, 500);
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
                    <h1>Login below</h1>
                    <Card>
                        <UserContext.Consumer>
                            {({ updateUser }) => (
                            <Form onSubmit={(e) => authenticate(e, updateUser)}>
                            <CardBody>
                                    <Row>
                                        <Col className="pl-md-1" md="12">
                                            <FormGroup>
                                                <label for="email">
                                                    Email address
                                                </label>
                                                <Input placeholder={"Your email here"} value={email ? email : ""} type="email" onChange={(val) => {
                                                    setEmail(val.target.value);
                                                }}/>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="pl-md-1" md="12">
                                            <FormGroup>
                                                <Label for="pass">Password</Label>
                                                <Input type="password" id="pass" placeholder="Your password here" onChange={(val) => {
                                                    setPass(val.target.value);
                                                }}/>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                            </CardBody>
                            <CardFooter className="text-center">
                                <Button className="btn-fill" color="info" type="submit" id="submit">
                                    Login
                                </Button>
                            </CardFooter>
                        </Form>)}
                    </UserContext.Consumer>
                </Card>
                    <h4>
                        Don't have an account?{" "}
                        <Link to="/create-account">Click here.</Link>
                    </h4>
                </Col>
            </div>
        </>
    );
}

export default Login;