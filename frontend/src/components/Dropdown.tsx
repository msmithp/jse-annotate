import React from "react";
import { useState } from "react";


export interface DropdownProps {
    // Format of `values`: {category, [list_of_skill_dictionaries]}
    values: {[category: string]: {
        id: number,
        name: string
    }[]},
    selected: number,
    onChange: (id: number) => void
}

function Dropdown({ values, selected, onChange }: DropdownProps) {
    // State variables
    const [selection, setSelection] = useState(selected);

    // Handler function
    function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const id = Number(event.currentTarget.value);
        setSelection(id);
        onChange(id);
    }

    // Create dropdown options
    // Iterate through each skill category:
    const options = Object.keys(values).map(category => 
        <optgroup label={category} key={"category-" + category}>
            {/* Iterate through each skill in this category: */}
            {values[category].map(skill =>
                <option key={skill.id} value={skill.id}>{skill.name}</option>
            )}
        </optgroup>
    );

    return(
        <div>
            <select
                onChange={e => handleChange(e)}
                value={selection}>
                <option disabled key={-1} value={-1}>Select a skill</option>
                {options}
            </select> 
        </div>
    )
}

export default Dropdown;
