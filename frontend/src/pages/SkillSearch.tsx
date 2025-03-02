import React from "react";
import { useState } from "react";


// Placeholder data
const locationValues = [
    {id: 0, name: "Maryland"}, {id: 1, name: "Virginia"},
    {id: 2, name: "Pennsylvania"}, {id: 3, name: "West Virginia"},
    {id: 4, name: "Delaware"}
].sort((x, y) => {return x.name.charCodeAt(0) - y.name.charCodeAt(0)});

interface SkillSearchFormProps {
    onUpdate: (location: number) => void
}

function SkillSearchForm({ onUpdate }: SkillSearchFormProps) {
    // State variables
    const [location, setLocation] = useState(-1);

    // Create dropdown options
    const locationOptions = locationValues.map(loc =>
        <option key={loc.id} value={loc.id}>{loc.name}</option>
    );

    return (
        <div>
            <p>Select a state</p>
            <select
                required
                value={location}
                onChange={e => {
                    e.preventDefault();
                    setLocation(Number(e.currentTarget.value));
                    onUpdate(Number(e.currentTarget.value))
                }}>
                <option>Select a state:</option>
                {locationOptions}
            </select>
        </div>
    )
}


function SkillSearch() {
    function handleSkillSearch(location: number) {
        console.log("Location: " + location)
    }

    return (
        <div>
            <h1>Skill search page</h1>
            <SkillSearchForm onUpdate={handleSkillSearch} />
        </div>
    )
}

export default SkillSearch;
