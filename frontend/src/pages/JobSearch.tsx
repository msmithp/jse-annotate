import React from "react";
import { useState } from "react";
import DropdownList from "../components/DropdownList";


// Placeholder data
const locationValues = [
    {id: 0, name: "Maryland"}, {id: 1, name: "Virginia"},
    {id: 2, name: "Pennsylvania"}, {id: 3, name: "West Virginia"},
    {id: 4, name: "Delaware"}
].sort((x, y) => {return x.name.charCodeAt(0) - y.name.charCodeAt(0)})
const educationValues = [
    {id: 0, level: "Less than high school"},
    {id: 1, level: "High school diploma"},
    {id: 2, level: "Associate's degree"},
    {id: 3, level: "Bachelor's degree"},
    {id: 4, level: "Master's degree"},
    {id: 5, level: "Doctorate degree or higher"}
]
const skillValues = {
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


interface JobSearchFormProps {
    onSubmit: (
        location: number, education: number,
        experience: number, skills: number[]
    ) => void
}

function JobSearchForm({ onSubmit }: JobSearchFormProps) {
    // State variables
    const [location, setLocation] = useState(-1);
    const [education, setEducation] = useState(-1);
    const [experience, setExperience] = useState(0);
    const [skills, setSkills] = useState([-1]);

    // Event handlers
    function handleSubmit(event: React.FormEvent): void {
        event.preventDefault();
        onSubmit(location, education, experience, skills);
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
    const locationOptions = locationValues.map(loc =>
        <option key={loc.id} value={loc.id}>{loc.name}</option>
    );

    const educationOptions = educationValues.map(edu =>
        <option key={edu.id} value={edu.id}>{edu.level}</option>
    );

    return (
        <form onSubmit={handleSubmit}>
            <label>
                <p>Location:</p>
                <select 
                    required
                    value={location}
                    onChange={e => {
                        e.preventDefault();
                        setLocation(Number(e.currentTarget.value));
                    }}>
                    <option disabled key={-1} value={-1}>
                        Select a state
                    </option>
                    {locationOptions}
                </select>
            </label>

            <label>
                <p>Education level:</p>
                <select
                    required
                    value={education}
                    onChange={e => {
                        e.preventDefault();
                        setEducation(Number(e.currentTarget.value));
                    }}>
                    <option disabled key={-1} value={-1}>
                        Select an education level
                    </option>
                    {educationOptions}
                </select>
            </label>

            <label>
                <p>Years of experience:</p>
                <input 
                    required
                    type="number"
                    defaultValue={0}
                    min={0}
                    onChange={e => {
                        // Update experience with validated input
                        e.preventDefault();
                        console.log(Math.max(Number(e.currentTarget.value), 0));
                        setExperience(Math.max(Number(e.currentTarget.value), 0))
                    }}
                    onBlur={e => {
                        // When user clicks off of input, update field with
                        // validated input
                        e.preventDefault();
                        e.currentTarget.value = String(experience);
                    }} />
            </label>
            
            <label>
                <p>Skills:</p>
                <DropdownList 
                    values={skillValues}
                    selections={skills}
                    onChange={handleDropdownChange}
                    onRemove={handleRemoveDropdown}/>
            </label>
            <div>
                <button type="submit">Search jobs</button>
            </div>
        </form>
    )
}


function JobSearch() {
    function handleJobSearch(location: number, education: number,
        experience: number, skills: number[]): void {
            console.log("Location: " + location 
                + "\nEducation: " + education + "\nExperience: "
                + experience + "\nSkills: " + skills);

            // Redirect to job search results
        }

    return (
        <div>
            <h1>Search Jobs</h1>
            <JobSearchForm onSubmit={handleJobSearch} />
        </div>
    )
}

export default JobSearch;
