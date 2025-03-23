import React from "react";
import { useState } from "react";
import DropdownList from "../components/DropdownList";
import { useStaticData } from "../context/StaticDataProvider";
import { mapDropdownSkills } from "../static/utils";


interface CreateAccountFormProps {
    onSubmit: (username: string, password: string, skills: number[]) => void
}

function CreateAccountForm({ onSubmit }: CreateAccountFormProps) {
    // Get static data (states, education levels, and skills)
    const staticData = useStaticData();
    const locationValues = staticData.states;
    const educationValues = staticData.eduLevels;
    const skillValues = staticData.skills;

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
                    values={mapDropdownSkills(skillValues)}
                    selections={skills}
                    categories={true}
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

    return (
        <div>
            <h1>Create Account</h1>
            <CreateAccountForm onSubmit={handleCreateAccount}/>
        </div>
    )
}

export default CreateAccount;
