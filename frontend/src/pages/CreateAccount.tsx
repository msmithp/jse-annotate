import React from "react";
import { useState } from "react";
import Dropdown from "../components/Dropdown";

const languages: string[]      = ["Python", "Java", "C", "C++", "JavaScript"];
const frameworks: string[]     = ["Django", "React", "Node.js", "Angular.js", "Express.js"];
const cloudPlatforms: string[] = ["Amazon Web Services (AWS)", "Google Cloud Platform (GCP)", 
                                  "Microsoft Azure"];
// const values = {"Programming Languages": languages, 
//     "Web Frameworks": frameworks, "Cloud Computing Platforms": cloudPlatforms};

// const values = [
//     {id: 0, name: "Python", category: "Programming Languages"},
//     {id: 1, name: "Java", category: "Programming Languages"},
//     {id: 2, name: "C", category: "Programming Languages"},
//     {id: 3, name: "C++", category: "Programming Languages"},
//     {id: 4, name: "JavaScript", category: "Programming Languages"},
//     {id: 5, name: "Django", category: "Web Frameworks"},
//     {id: 6, name: "React", category: "Web Frameworks"},
//     {id: 7, name: "Node.js", category: "Web Frameworks"},
//     {id: 8, name: "Angular.js", category: "Web Frameworks"},
//     {id: 9, name: "Express.js", category: "Web Frameworks"},
//     {id: 10, name: "Amazon Web Services (AWS)", category: "Cloud Platforms"},
//     {id: 11, name: "Google Cloud Platform (GCP)", category: "Cloud Platforms"},
//     {id: 12, name: "Microsoft Azure", category: "Cloud Platforms"}
// ]

const values = {
    "Programming Languages": [
        {id: 0, name: "Python"}, {id: 1, name: "Java"},
        {id: 2, name: "C"}, {id: 3, name: "C++"}, {id: 4, name: "JavaScript"}
    ], "Web Frameworks": [
        {id: 5, name: "Django"}, {id: 6, name: "React"}, {id: 7, name: "Node.js"},
        {id: 8, name: "Angular.js"}, {id: 9, name: "Express.js"}
    ], "Cloud Computing Platforms": [
        {id: 10, name: "Amazon Web Services (AWS)"}, {id: 11, name: "Google Cloud Platform (GCP)"},
        {id: 12, name: "Microsoft Azure"}
    ]
};

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
            <label>
                <p>Skills</p>
                <Dropdown values={values} />
                {/* <select>
                    <optgroup label="Programming languages">
                        <option>First skill</option>
                        <option>Second skill</option>
                        <option>Third skill</option>
                    </optgroup>
                    <optgroup label="Cloud platforms">
                        <option>Fourth skill</option>
                        <option>Fifth skill</option>
                        <option>Sixth skill</option>
                    </optgroup>
                </select> */}
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
