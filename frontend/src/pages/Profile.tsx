import React from "react";
import { useState, useEffect } from "react";
import { DropdownList, MessageBox } from "../components";
import { mapDropdownSkills } from "../static/utils";
import { User } from "../static/types";
import { useStaticData } from "../context/StaticDataProvider";
import { useAuthContext } from "src/context/AuthProvider";
import axiosInstance from "../api/axiosInstance";
import axios from "axios";


interface EditProfileFormProps {
    onSubmit: (state: number, education: string,
        experience: number, skills: number[]) => void,
    user: User
}

function EditProfileForm({ onSubmit, user }: EditProfileFormProps) {
    // Get static data (states, education levels, and skills)
    const staticData = useStaticData();
    const locationValues = staticData.states;
    const educationValues = staticData.eduLevels;
    const skillValues = staticData.skills;
    const experienceValues = staticData.experience;

    // State variables
    const [state, setState] = useState(user.state);
    const [education, setEducation] = useState(user.education);
    const [experience, setExperience] = useState(user.yearsExperience);
    const [skills, setSkills] = useState(user.skills.map(skill => skill.id));

    // Event handlers
    function handleSubmit(event: React.FormEvent): void {
        event.preventDefault();  // Prevent default form submission
        onSubmit(state, education, experience, skills);
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
                <button type="submit">Update profile</button>
            </div>
        </form>
    )
}

function Profile() {
    // State variables
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const authData = useAuthContext();
    const user = authData.user;
    const logoutUser = authData.logoutUser;

    // Retrieve user data from back-end
    useEffect(() => {
        let ignore = false;
        setUserData(null);
        if (user) {
            axiosInstance.get("api/get-user/", {params: {id: user.user_id}})
            .then(res => {
                if (!ignore) {
                    setUserData(res.data);
                    setLoading(false);
                }
            }).catch(err => {console.log("Error in profile page: " + err); logoutUser()});
        }

        return () => {
            ignore = true;
        }
    }, []);

    function handleEditProfile(state: number, education: string,
        experience: number, skills: number[]): void {
        // Reset message boxes
        setSuccess(false);
        setError(false);

        console.log("State: " + state + " Education: " + education
            + " Experience: " + experience + " Skills: " + skills);

        // Remove empty dropdown boxes from consideration
        skills = skills.filter(sk => sk !== -1);
        
        // Send updated data to back-end to update profile
        axios.post("http://127.0.0.1:8000/api/update-account/", {
            userID: user?.user_id,
            stateID: state,
            education: education,
            yearsExperience: experience,
            skills: skills
        }).then((res) => {
            if (res.status === 200) {
                // Success - display success message box
                setSuccess(true);
            } 
        }).catch((err) => {
            // Failure - display error message box
            setError(true);
        })

        // Scroll to top of page after form submission
        window.scrollTo(0, 0);
    }

    return (
        <div>
            <h1>Edit profile</h1>
            {/* If currently loading, set loading screen */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                // Otherwise, check if user is not null (i.e., user is logged in)
                user ? (
                    // Then check if user data was successfully loaded
                    userData ? (
                        // User is logged in and user data was successfully loaded
                        <div>
                            {success && <MessageBox 
                                type={"success"} 
                                text={"Successfully updated account."}/>
                            }
                            {error && <MessageBox 
                                type={"error"}
                                text={"Error updating account."} />
                            }
                            <EditProfileForm onSubmit={handleEditProfile} user={userData} />
                        </div>
                    ) : (
                        // User is logged in, but user data could not be loaded
                        <div>
                            <p>Unable to load profile data.</p>
                        </div>
                    )
                ) : (
                    // User is not logged in
                    <div>
                        <p>Log in to see your profile</p>
                    </div>
                )
            )}
        </div>
    )
}

export default Profile;