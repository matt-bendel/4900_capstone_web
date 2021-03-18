import Login from "../../views/Login";
import CreateAccount from "../../views/CreateAccount";


var register_routes = [
    {
        path: "/login",
        name: "Login",
        component: Login,
        layout: "/registration",
    },
    {
        path: "/create-account",
        name: "Sign Up",
        component: CreateAccount,
        layout: "/registration",
    },
];
export default register_routes;