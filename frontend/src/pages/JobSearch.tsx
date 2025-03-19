import React from "react";
import { useState } from "react";
import { DropdownList, JobList } from "../components";
import { useStaticData } from "../context/StaticDataProvider";
import axios from "axios";


interface JobSearchFormProps {
    onSubmit: (
        location: number, education: string,
        experience: number, skills: number[]
    ) => void
};

function JobSearchForm({ onSubmit }: JobSearchFormProps) {
    // Get static data (states, education levels, and skills)
    const staticData = useStaticData();
    const locationValues = staticData.states;
    const educationValues = staticData.eduLevels;
    const skillValues = staticData.skills;

    // State variables
    const [location, setLocation] = useState(-1);
    const [education, setEducation] = useState("none");
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
        <option key={edu.value} value={edu.value}>{edu.level}</option>
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

interface Job {
    id: number,
    title: string,
    company: string,
    cityName: string,
    stateCode: string,
    description: string,
    minSalary: number,
    maxSalary: number,
    link: string,
    score: number,
    skills: string[],
    education: string,
    yearsExperience: number
}

function JobSearch() {
    const [jobs, setJobs] = useState<Job[]>([]);

    function handleJobSearch(location: number, education: string,
        experience: number, skills: number[]): void {
            console.log("Location: " + location 
                + "\nEducation: " + education + "\nExperience: "
                + experience + "\nSkills: " + skills);

        // Set resulting jobs by retrieving job data from the back-end
        setJobs([]);

        const params = {
            stateID: location,
            education: education,
            yearsExperience: experience,
            skills: skills
        }

        axios.get("http://127.0.0.1:8000/api/job-search/", {params: params})
        .then((res) => {
            const jobData: Job[] = res.data.jobs;
            // Sort job data in decreasing order by compatibility score
            jobData.sort((x, y) => {return y.score - x.score});
            setJobs(res.data.jobs);
        })
        .catch((err) => console.log(err));
    }

    return (
        <div>
            <h1>Search jobs</h1>
            <JobSearchForm onSubmit={handleJobSearch} />
            { jobs.length === 0 ?
                <></>
            :
                <JobList jobs={jobs} />
            }
        </div>
    )
}

export default JobSearch;
