/** SkillSearch.tsx * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * The SkillSearch component is a page where users can find what skills are
 * most desired by employers. A form is provided to select one or many U.S.
 * states. When states are added or removed, a map and charts are updated to
 * display the most in-demand skills in those states. Charts are broken down
 * by skill category, while the map shows the most popular skill in each
 * county of each chosen state.
 */


import { useState } from "react";
import { SkillSearchMap, ChartGrid, DropdownList } from "../components";
import { useStaticData } from "../context/StaticDataProvider";
import { mapDropdownStates } from "../static/utils";
import { ChartSkillData, StateSkillData } from "../static/types";
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
            <form>
                <label>
                    <p>Select states:</p>
                        <DropdownList 
                            values={mapDropdownStates(stateValues)}
                            selections={states}
                            categories={false}
                            onChange={handleStateDropdownChange}
                            onRemove={handleRemoveStateDropdown}/>
                </label>
            </form>
        </div>
    )
}

function SkillSearch() {
    const [skillData, setSkillData] = useState<ChartSkillData[]>([]);
    const [stateSkills, setStateSkills] = useState<StateSkillData[]>([]);

    function handleSkillSearch(states: number[]) {
        // Call back-end to retrieve skill data for these states
        // and assign it to skillData using setSkillData()
        const params = {
            // Filter out blank dropdown selections
            states: states.filter((id) => id !== -1)
        }

        axios.get("http://127.0.0.1:8000/api/skill-search/", {params: params})
        .then((res) => {
            setSkillData(res.data.skills);
            setStateSkills(res.data.counties);
        })
        .catch((err) => console.log(err));
    }

    return (
        <div className="skillSearch">
            <h1>Find in-demand skills</h1>
            <SkillSearchForm onUpdate={handleSkillSearch} />
            { skillData.length === 0 || stateSkills.length === 0 ?
                <></>
            :
                <div className="skillSearchResults">
                    <SkillSearchMap stateSkills={stateSkills} />
                    <ChartGrid data={skillData} />
                </div>
            }
        </div>
    )
}

export default SkillSearch;
