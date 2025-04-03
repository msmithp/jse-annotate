import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "src/context/AuthProvider";
import { MessageBox } from "../components";


interface LoginFormProps {
    handler: (username: string, password: string) => void
}

function LoginForm({ handler }: LoginFormProps) {
    function handleSubmit(event: React.FormEvent): void {
        event.preventDefault();  // Prevent default form submission
        handler(username, password);  // Pass username and password to handler
    }

    // State variables
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return(
        <form onSubmit={handleSubmit}>
            <label>
                <p>Username:</p>
                <input 
                    value={username}
                    required
                    onChange={(e) => {setUsername(e.currentTarget.value);}}
                    type="text"
                />
            </label>
            <label>
                <p>Password:</p>
                <input 
                    value={password}
                    required
                    onChange={(e) => {setPassword(e.currentTarget.value);}} 
                    type="password"
                />
            </label>
            <div>
                <button type="submit">Log in</button>
            </div>
        </form>
    )
}


function Login() {
    // State variables
    const [error, setError] = useState(false);

    const authData = useAuthContext();
    const loginUser = authData.loginUser;

    async function handleLogin(username: string, password: string): Promise<void> {
        // Reset error message box
        setError(false);
        console.log("Username: " + username + " Password: " + password);

        // Send username and password to back-end to validate user
        const res = await loginUser(username, password);
        if (!res) {
            // If login failed, set error message box
            setError(true);
        }
    }

    return (
        <div>
            <h1>Log In</h1>
            {error && <MessageBox type={"error"} text={"Invalid login credentials"} />}
            <LoginForm handler={handleLogin}/>
            <NavLink to="/create-account">Create an account</NavLink>
        </div>
    )
}

export default Login;
