import React, { useState, useEffect } from "react";
import { UserContext} from "../../contexts/UserContext";
import firebase from "firebase";
import {themes} from "../../contexts/ThemeContext";

export default function UserContextWrapper(props) {
    const [user, setUser] = useState(null);
    const [update, setUpdate] = useState(false);

    function updateUser(user, update_var) {
        setUser(user);
        setUpdate(update_var);
    }

    useEffect(() => {
        if (update) {
            firebase.firestore().collection('users').doc(user.contactEmail).set({
                theme: user.theme,
                companyName: user.companyName,
                contactEmail: user.contactEmail,
                linkedDevice: user.linkedDevice,
                deviceId: user.deviceId,
            });
            setUpdate(false);
        }
    });

    return (
        <UserContext.Provider value={{ user: user, updateUser: updateUser }}>
            {props.children}
        </UserContext.Provider>
    );
}
