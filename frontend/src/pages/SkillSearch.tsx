import React from "react";
import { useState } from "react";
import { SkillSearchMap, SkillChart, DropdownList } from "../components";
import { useStaticData } from "../context/StaticDataProvider";
import { mapDropdownStates } from "../static/utils";
import axios from "axios";


interface SkillSearchFormProps {
    onUpdate: (states: number[]) => void
}

function SkillSearchForm({ onUpdate }: SkillSearchFormProps) {
    // Get static data (states)
    const staticData = useStaticData();
    const stateValues = staticData.states;

    // State variables
    const [states, setStates] = useState([-1]);

    // Event handlers
    function handleStateDropdownChange(index: number, id: number): void {
        const updatedLocations = [...states];
        updatedLocations[index] = id;
        setStates(updatedLocations);
        onUpdate(updatedLocations);
    }

    function handleRemoveStateDropdown(index: number): void {
        const newStates = states.filter((_, i) => i !== index);
        setStates(newStates);
        onUpdate(newStates);
    }

    return (
        <div>
            <label>
                <p>Select states:</p>
                    <DropdownList 
                        values={mapDropdownStates(stateValues)}
                        selections={states}
                        categories={false}
                        onChange={handleStateDropdownChange}
                        onRemove={handleRemoveStateDropdown}/>
            </label>
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

    function handleSkillSearch(states: number[]) {
        // Call back-end to retrieve skill data for this state
        // and assign it to skillData using setSkillData()
        const params = {
            states: states.filter((x) => x !== -1)
        }

        axios.get("http://127.0.0.1:8000/api/skill-search/", {params: params})
        .then((res) => {
            setSkillData(res.data.skills);
        })
        .catch((err) => console.log(err));
    }

    return (
        <div>
            <h1>Find in-demand skills</h1>
            <SkillSearchForm onUpdate={handleSkillSearch} />
            { skillData.length === 0 ?
                <></>
            :
                <div>
                    <SkillChart skillData={skillData} />
                    {/* <SkillSearchMap /> */}
                </div>
            }
            {/* <SkillSearchMap /> */}
        </div>
    )
}

export default SkillSearch;
