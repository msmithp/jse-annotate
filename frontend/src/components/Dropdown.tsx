import React from "react";

interface DropdownProps {
    values: {[category: string]: {
        id: number,
        name: string
    }[]}
}

function Dropdown({ values }: DropdownProps) {
    // For each category:
    const options = Object.keys(values).map(category => 
        <optgroup label={category}>
            {/* For each skill in this category: */}
            {values[category].map(skill =>
                <option key={skill.id}>{skill.name}</option>
            )}
        </optgroup>
    );

    return(
        <div>
            <select>{options}</select>
        </div>
    )
}

export default Dropdown;
