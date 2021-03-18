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
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import firebase from "firebase";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "routes.js";

import logo from "assets/img/react-logo.png";
import {UserContext} from "../../contexts/UserContext";
import Loader from "react-loaders";
import RegisterNavbar from "../../components/Navbars/RegisterNavbar";
import {ThemeContext} from "../../contexts/ThemeContext";

let loader = <Loader type="ball-pulse-sync" style={{textAlign: "center", alignSelf: "center"}}/>
var ps;

function Admin(props) {
  const location = useLocation();
  const mainPanelRef = React.useRef(null);
  const [sidebarOpened, setsidebarOpened] = React.useState(
    document.documentElement.className.indexOf("nav-open") !== -1
  );
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      ps = new PerfectScrollbar(mainPanelRef.current, {
        suppressScrollX: true,
      });
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.documentElement.classList.add("perfect-scrollbar-off");
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
    };
  });
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainPanelRef.current) {
      mainPanelRef.current.scrollTop = 0;
    }
  }, [location]);
  // this function opens and closes the sidebar on small devices
  const toggleSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    setsidebarOpened(!sidebarOpened);
  };
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "ECE 4900 Capstone";
  };
  const getUserInfo = async (email, updateFunc) => {
    await firebase.firestore().collection('users').doc(email).get().then((doc) => {
      console.log(doc.data());
      updateFunc({
        theme: doc.data().theme,
        companyName: doc.data().companyName,
        contactEmail: email,
        linkedDevice: doc.data().linkedDevice,
        deviceId: doc.data().deviceId,
      }, false);
    }).finally(() => {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }).catch((e) => console.log(e));
  }

  return (
      <React.Fragment>
        <ThemeContext.Consumer>
          {({changeTheme}) => (
              <UserContext.Consumer>
                {({user, updateUser}) => {
                  if (user && user.companyName === "") {
                    getUserInfo(user.contactEmail, updateUser);
                    return(
                        <React.Fragment>
                          <div className="wrapper">
                            <div className="main-panel" ref={mainPanelRef} data={"blue"}>
                              <RegisterNavbar />
                              <>
                                <div className="login-content" style={{display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center"}}>
                                  {loader}
                                </div>
                              </>
                            </div>
                          </div>
                        </React.Fragment>
                    );
                  }

                  if (loading) {
                    if (user) {
                      changeTheme(user.theme);
                      setTimeout(() => {
                        setLoading(false);
                      }, 1000);
                    }

                    return(
                        <React.Fragment>
                          <div className="wrapper">
                            <div className="main-panel" ref={mainPanelRef} data={"blue"}>
                              <RegisterNavbar />
                              <>
                                <div className="login-content" style={{display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center"}}>
                                  {loader}
                                </div>
                              </>
                            </div>
                          </div>
                        </React.Fragment>
                    );
                  }

                  return (
                      <>
                        <div className="wrapper">
                          <Sidebar
                              routes={routes}
                              logo={{
                                text: user.companyName,
                                imgSrc: logo,
                              }}
                              toggleSidebar={toggleSidebar}
                          />
                          <div className="main-panel" ref={mainPanelRef} data={"blue"}>
                            <AdminNavbar
                                    brandText={getBrandText(location.pathname)}
                                    toggleSidebar={toggleSidebar}
                                    sidebarOpened={sidebarOpened}
                                />
                            <Switch>
                              {getRoutes(routes)}
                              <Redirect from="*" to={user.linkedDevice ? "/dashboard" : "/register-device"} />
                            </Switch>
                          </div>
                        </div>
                        <FixedPlugin bgColor={"blue"} />
                      </>
                  );
                }}
              </UserContext.Consumer>
            )
          }
        </ThemeContext.Consumer>
      </React.Fragment>
  );
}

export default Admin;
