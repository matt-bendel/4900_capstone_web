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

// reactstrap components
import {
    NavbarBrand,
    Navbar,
    Container,
} from "reactstrap";

function RegisterNavbar() {
    const [color, setcolor] = React.useState("navbar-transparent");
    React.useEffect(() => {
        window.addEventListener("resize", updateColor);
        // Specify how to clean up after this effect:
        return function cleanup() {
            window.removeEventListener("resize", updateColor);
        };
    });
    // function that adds color white/transparent to the navbar on resize (this is for the collapse)
    const updateColor = () => {
        if (window.innerWidth < 993) {
            setcolor("bg-white");
        } else {
            setcolor("navbar-transparent");
        }
    };

    return (
        <>
        <Navbar className={classNames("navbar-absolute", color)} expand="lg">
            <Container fluid>
                <div className="navbar-wrapper">
                    <NavbarBrand href="#pablo" onClick={(e) => e.preventDefault()} style={{marginTop: "20px"}}>
                        ECE 4900 Capstone
                    </NavbarBrand>
                </div>
            </Container>
        </Navbar>
        </>
    );
}

export default RegisterNavbar;
