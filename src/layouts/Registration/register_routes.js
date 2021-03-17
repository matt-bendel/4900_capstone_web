import Login from "../../views/Login";


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
        component: null,
        layout: "/registration",
    },
];
export default register_routes;