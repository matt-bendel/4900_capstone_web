import React, { useState, useEffect } from "react";
import { UserContext} from "../../contexts/UserContext";
import firebase from "firebase";

export default function UserContextWrapper(props) {
    const [user, setUser] = useState(null);

    function updateUser(user, update) {
        setUser(user);

        if (update) {
            updateFirebase();
        }
    }

    async function updateFirebase() {
        await firebase.firestore().collection('users').doc(user.contactEmail).update({
            theme: user.theme
        });
    }

    return (
        <UserContext.Provider value={{ user: user, updateUser: updateUser }}>
            {props.children}
        </UserContext.Provider>
    );
}
