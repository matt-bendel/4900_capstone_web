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
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import firebase from './Firebase/Firebase';
import { FirebaseAuthProvider, FirebaseAuthConsumer } from "@react-firebase/auth";
import { FirestoreProvider } from "@react-firebase/firestore";

import firebaseConfig from './config/config';
import AdminLayout from "layouts/Admin/Admin.js";

import "assets/scss/black-dashboard-react.scss";
import "assets/demo/demo.css";
import "assets/css/nucleo-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import ThemeContextWrapper from "./components/ThemeWrapper/ThemeWrapper";
import UserContextWrapper from "./components/UserWrapper/UserWrapper";
import RegisterLayout from "./layouts/Registration/Register";
import {UserContext} from "./contexts/UserContext";
let initialLoad = true;

ReactDOM.render(
  <ThemeContextWrapper>
      <UserContextWrapper>
          <FirebaseAuthProvider firebase={firebase.default} {...firebaseConfig}>
              <FirestoreProvider {...firebaseConfig} firebase={firebase.default}>
                  <BrowserRouter>
                    <Switch>
                        <UserContext.Consumer>
                            {({updateUser}) =>
                                (<FirebaseAuthConsumer>
                                    {({ isSignedIn, user, providerId }) => {
                                        if (!isSignedIn) {
                                            return <Route path="/" render={(props) => <RegisterLayout {...props} />} />;
                                        }

                                        if (initialLoad) {
                                            initialLoad = false;
                                            updateUser({
                                                theme: "",
                                                companyName: "",
                                                contactEmail: user.email,
                                                linkedDevice: false,
                                            }, false);
                                        }
                                        return <Route path="/" render={(props) => <AdminLayout {...props} />} />;
                                    }}
                                </FirebaseAuthConsumer>)
                            }
                        </UserContext.Consumer>
                      <Redirect from="/" to="/dashboard" />
                    </Switch>
                  </BrowserRouter>
              </FirestoreProvider>
          </FirebaseAuthProvider>
      </UserContextWrapper>
  </ThemeContextWrapper>,
  document.getElementById("root")
);
