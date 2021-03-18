import { createContext } from "react";
import {themes} from "./ThemeContext";

export const UserContext = createContext({
    user: {
        theme: themes.dark,
        companyName: "",
        contactEmail: "",
        linkedDevice: false,
        deviceId: "",
    },
    updateUser: () => {},
});