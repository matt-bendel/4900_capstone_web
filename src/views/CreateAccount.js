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

    const authenticate = (event, updateUserContext) => {
        setLoading(true);
        event.preventDefault();

        if (pass === ""){
            setIsPass(false);
        } else {
            setIsPass(true);
        }

        if (email === "" || !email){
            setIsEmail(false);
        } else {
            setIsEmail(true);
        }

        if (companyName === ""){
            setIsCompany(false);
        } else {
            setIsCompany(true);
        }


        if (pass === "" || email === "" || !email || companyName === "") {
            setTimeout(() => {
                setLoading(false);
                notify("Please do not leave any fields blank.");
            }, 1000)
            return;
        }

        firebase.auth().createUserWithEmailAndPassword(email, pass)
        .then((userCredential) => {
            updateUserContext({
                theme: "",
                companyName: companyName,
                contactEmail: email,
                linkedDevice: false,
                deviceId: "",
            }, true);
        })
        .catch((error) => {
            console.log(error);
            setTimeout(() => {
                setLoading(false);
                notify("Something went wrong creating your account. Please try again.");
            }, 1000)
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
                    <h1>Register your new account</h1>
                    <Card>
                        <UserContext.Consumer>
                            {({ updateUser }) => (
                                <Form onSubmit={(e) => authenticate(e, updateUser)}>
                                    <CardBody>
                                        <Row>
                                            <Col className="pl-md-1" md="12">
                                                <FormGroup>
                                                    <Label for="name">Company or Organization Name</Label>
                                                    <Input invalid={!isValidCompany} id="name" placeholder="Your company name here" value={companyName !== "" ? companyName : ""} onChange={(val) => {
                                                        setCompanyName(val.target.value);
                                                    }}/>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="pl-md-1" md="12">
                                                <FormGroup>
                                                    <label for="email">
                                                        Email address
                                                    </label>
                                                    <Input invalid={!isValidEmail} placeholder={"Your email here"} value={email ? email : ""} type="email" onChange={(val) => {
                                                        setEmail(val.target.value);
                                                    }}/>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="pl-md-1" md="12">
                                                <FormGroup>
                                                    <Label for="pass">Password</Label>
                                                    <Input invalid={!isValidPass} type="password" id="pass" placeholder="Your password here" onChange={(val) => {
                                                        setPass(val.target.value);
                                                    }}/>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="pl-md-1" md="12">
                                                <FormGroup>
                                                    <Label for="pass2">Confirm Password</Label>
                                                    <Input invalid={!isValidPassConfirm} valid={pass === confirmPass && confirmPass !== ""} type="password" id="pass" placeholder="Your password here" onChange={(val) => {
                                                        setConfirmPass(val.target.value);
                                                    }}/>
                                                    <FormFeedback tooltip>Your password does not match.</FormFeedback>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                    <CardFooter className="text-center">
                                        <Button className="btn-fill" color="info" type="submit" id="submit">
                                            Register
                                        </Button>
                                    </CardFooter>
                                </Form>)}
                        </UserContext.Consumer>
                    </Card>
                    <h4>
                        Already have an account?{" "}
                        <Link to="/login">Log in.</Link>
                    </h4>
                </Col>
            </div>
        </>
    );
}

export default CreateAccount;