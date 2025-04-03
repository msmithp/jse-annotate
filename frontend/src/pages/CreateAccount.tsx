import React from "react";
import { useState } from "react";
import { DropdownList, MessageBox } from "../components";
import { useStaticData } from "../context/StaticDataProvider";
import { mapDropdownSkills } from "../static/utils";
import { useNavigate } from "react-router-dom";
import axios from "axios";


interface CreateAccountFormProps {
    onSubmit: (username: string, password: string, 
        state: number, education: string,
        experience: number, skills: number[]) => void
}

function CreateAccountForm({ onSubmit }: CreateAccountFormProps) {
    // Get static data (states, education levels, and skills)
    const staticData = useStaticData();
    const locationValues = staticData.states;
    const educationValues = staticData.eduLevels;
    const skillValues = staticData.skills;
    const experienceValues = staticData.experience;

    // State variables
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [state, setState] = useState(-1);
    const [education, setEducation] = useState("none");
    const [experience, setExperience] = useState(0);
    const [skills, setSkills] = useState([-1]);

    // Event handlers
    function handleSubmit(event: React.FormEvent): void {
        event.preventDefault();  // Prevent default form submission
        onSubmit(username, password, state, education, experience, skills);
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

    // Create dropdown options
    const stateOptions = locationValues.map(loc =>
        <option key={loc.id} value={loc.id}>{loc.name}</option>
    );

    const educationOptions = educationValues.map(edu =>
        <option key={edu.value} value={edu.value}>{edu.level}</option>
    );

    const experienceOptions = experienceValues.map(exp =>
        <option key={exp.id} value={exp.id}>{exp.years}</option>
    );

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
                 <p>Location:</p>
                 <select 
                     required
                     value={state}
                     onChange={e => {
                         e.preventDefault();
                         setState(Number(e.currentTarget.value));
                     }}>
                     <option disabled key={-1} value={-1}>
                         Select a state
                     </option>
                     {stateOptions}
                 </select>
            </label>

            <label>
                <p>Education level:</p>
                <select
                    required
                    value={education}
                    onChange={e => {
                        e.preventDefault();
                        setEducation(e.currentTarget.value);
                    }}>
                    <option disabled key={-1} value={"none"}>
                        Select an education level
                    </option>
                    {educationOptions}
                </select>
            </label>

            <label>
                <p>Years of experience:</p>
                <select
                    required
                    value={experience}
                    onChange={e => {
                        e.preventDefault();
                        setExperience(Number(e.currentTarget.value));
                    }}>
                    {experienceOptions}
                </select>
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
    // State variables
    const [error, setError] = useState("");

    const navigate = useNavigate();

    function handleCreateAccount(username: string, 
        password: string, state: number, education: string,
        experience: number, skills: number[]): void {
        setError("");

        // Remove empty skill dropdown boxes from consideration
        skills = skills.filter(sk => sk !== -1);

        console.log("Username: " + username 
            + " Password: " + password + " State: " + state
            + " Education: " + education + " Experience: " + experience
            + " Skills: " + skills);

        if (username === "") {
            setError("You must enter a username.");
            return;
        } else if (password === "") {
            setError("You must enter a password.");
            return;
        } else if (state === -1) {
            setError("You must select a state.");
            return;
        } else if (education === "none") {
            setError("You must select an education level.");
            return;
        }
        
        // Send username and password to back-end to create account
        axios.post("http://127.0.0.1:8000/api/create-account/", {
            username: username,
            password: password,
            stateID: state,
            education: education,
            yearsExperience: experience,
            skills: skills
        }).then((res) => {
            if (res.status === 200) {
                // Success - redirect user to login page
                navigate("/login");
            } 
        }).catch((err) => {
            if (err.status === 409) {
                setError("Error: Username \"" + username + "\" is already taken");
            } else if (err.status === 403) {
                setError("Error: " + err.response.data);
            }
        })
    }

    return (
        <div>
            <h1>Create Account</h1>
            {error !== "" && <MessageBox type={"error"} text={error} />}
            <CreateAccountForm onSubmit={handleCreateAccount}/>
        </div>
    )
}

export default CreateAccount;
