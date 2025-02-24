import React from "react";
import { useState } from "react";

interface CreateAccountFormProps {
    handler: (username: string, password: string) => void
}

function CreateAccountForm({ handler }: CreateAccountFormProps) {
    function handleSubmit(event: React.FormEvent): void {
        event.preventDefault();  // Prevent default form submission
        handler(username, password);
    }

    // State variables
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <form onSubmit={handleSubmit}>
            <label>
                <p>Username</p>
                <input
                    value={username}
                    required
                    onChange={(e) => {setUsername(e.currentTarget.value);}}
                    type="text"
                />
            </label>
            <label>
                <p>Password</p>
                <input
                    value={password}
                    required
                    onChange={(e) => {setPassword(e.currentTarget.value);}}
                    type="password"
                />
            </label>
            <div>
                <button type="submit">Create account</button>
            </div>
        </form>
    )
}


function CreateAccount() {
    function handleCreateAccount(username: string, password: string): void {
        console.log("Username: " + username + " Password: " + password);
        
        // Send username and password to back-end to create account

        // Redirect user to home page after account creation
    }

    return (
        <div>
            <h1>Create Account</h1>
            <CreateAccountForm handler={handleCreateAccount}/>
        </div>
    )
}

export default CreateAccount;
