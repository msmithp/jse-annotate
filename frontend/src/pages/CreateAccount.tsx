import React from "react";
import { useState } from "react";
import DropdownList from "../components/DropdownList";


// Placeholder data
const values = {
    "Programming Languages": [
        {id: 0, name: "Python"}, {id: 1, name: "Java"},
        {id: 2, name: "C"}, {id: 3, name: "C++"}, {id: 4, name: "JavaScript"}
    ], "Web Frameworks": [
        {id: 5, name: "Django"}, {id: 6, name: "React"}, {id: 7, name: "Node.js"},
        {id: 8, name: "Angular.js"}, {id: 9, name: "Express.js"}
    ], "Cloud Computing Platforms": [
        {id: 10, name: "Amazon Web Services (AWS)"},
        {id: 11, name: "Google Cloud Platform (GCP)"},
        {id: 12, name: "Microsoft Azure"}
    ]
};

interface CreateAccountFormProps {
    onSubmit: (username: string, password: string, skills: number[]) => void
}

function CreateAccountForm({ onSubmit }: CreateAccountFormProps) {
    // State variables
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [skills, setSkills] = useState([-1]);

    // Event handlers
    function handleSubmit(event: React.FormEvent): void {
        event.preventDefault();  // Prevent default form submission
        onSubmit(username, password, skills);
    }

    function handleDropdownChange(index: number, id: number): void {
        // Copy list of dropdown selections
        const updatedSkills = [...skills];
        // Update dropdown list at index of changed dropdown
        updatedSkills[index] = id;
        // Update dropdown state variable with new list
        setSkills(updatedSkills);
    }

    function handleRemoveDropdown(index: number): void {
        // Remove the skill at the selected index
        setSkills(skills.filter((_, i) => i !== index));
    }

    return (
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
            
            <label>
                <p>Skills:</p>
                <DropdownList
                    values={values}
                    selections={skills}
                    onChange={handleDropdownChange}
                    onRemove={handleRemoveDropdown} />
            </label>
            <div>
                <button type="submit">Create account</button>
            </div>
        </form>
    )
}


function CreateAccount() {
    function handleCreateAccount(username: string, 
        password: string, skills: number[]): void {
        console.log("Username: " + username 
            + " Password: " + password + " Skills: " + skills);
        
        // TODO: Send username and password to back-end to create account

        // TODO: Redirect user to login page after account creation
    }

    // TODO: pull skills from back-end

    return (
        <div>
            <h1>Create Account</h1>
            <CreateAccountForm onSubmit={handleCreateAccount}/>
        </div>
    )
}

export default CreateAccount;
