import React from "react";
import { useAuthContext } from "src/context/AuthProvider";

function Profile() {
    const authData = useAuthContext();
    const user = authData.user;

    return (
        user? (
        <div>
            <h1>Edit profile</h1>
        </div>
        ) : (
            <div>
                <p>Log in to see your profile</p>
            </div>
        )
    )
}

export default Profile;