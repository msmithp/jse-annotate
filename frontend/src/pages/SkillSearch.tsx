import React from "react";
import { useState } from "react";
import { SkillSearchMap, SkillChart } from "../components";
import { useStaticData } from "../context/StaticDataProvider";

// Temporary data
let tempData = [
    {id: 0, skillName: "Python", occurrences: 280},
    {id: 1, skillName: "Java", occurrences: 20},
    {id: 2, skillName: "JavaScript", occurrences: 300},
    {id: 3, skillName: "C++", occurrences: 135},
    {id: 4, skillName: "C", occurrences: 1}
];


interface SkillSearchFormProps {
    onUpdate: (stateID: number) => void
}

function SkillSearchForm({ onUpdate }: SkillSearchFormProps) {
    // Get static data (states)
    const staticData = useStaticData();
    const stateValues = staticData.states;

    // State variables
    const [state, setState] = useState(-1);

    // Create dropdown options
    const locationOptions = stateValues.map(loc =>
        <option key={loc.id} value={loc.id}>{loc.name}</option>
    );

    return (
        <div>
            <p>Select a state</p>
            <select
                required
                value={state}
                onChange={e => {
                    e.preventDefault();
                    setState(Number(e.currentTarget.value));
                    onUpdate(Number(e.currentTarget.value))
                }}>
                <option disabled key={-1} value={-1}>Select a state:</option>
                {locationOptions}
            </select>
        </div>
    )
}

interface SkillData {
    id: number;
    skillName: string;
    occurrences: number;
}

function SkillSearch() {
    const [skillData, setSkillData] = useState<SkillData[]>(tempData);

    function handleSkillSearch(stateID: number) {
        console.log("State: " + stateID);
        setSkillData(
            skillData.map((skill) => {
                return {id: skill.id, skillName: skill.skillName, occurrences: Math.floor(Math.random() * 300)}
            })
        );
        
    }

    return (
        <div>
            <h1>Skill search page</h1>
            <SkillSearchForm onUpdate={handleSkillSearch} />
            <SkillChart skillData={skillData} />
            {/* <SkillSearchMap /> */}
        </div>
    )
}

export default SkillSearch;
