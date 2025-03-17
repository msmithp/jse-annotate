import React from "react";
import { useState } from "react";
import { SkillSearchMap, SkillChart } from "../components";
import { useStaticData } from "../context/StaticDataProvider";
import axios from "axios";


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
    const [skillData, setSkillData] = useState<SkillData[]>([]);

    function handleSkillSearch(stateID: number) {
        // Call back-end to retrieve skill data for this state
        // and assign it to skillData using setSkillData()
        const params = {
            stateID: stateID
        }

        axios.get("http://127.0.0.1:8000/api/skill-search/", {params: params})
        .then((res) => {
            setSkillData(res.data.skills);
        })
        .catch((err) => console.log(err));
    }

    return (
        <div>
            <h1>Skill search page</h1>
            <SkillSearchForm onUpdate={handleSkillSearch} />
            { skillData.length === 0 ?
                <></>
            :
                <SkillChart skillData={skillData} />
                //<SkillSearchMap />
            }
        </div>
    )
}

export default SkillSearch;
