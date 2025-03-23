import React from "react";
import { useState } from "react";


export interface DropdownProps {
    // Format of `values`: {category, [list_of_item_dictionaries]}
    values: {
        category: string,
        items: {
            id: number,
            name: string
        }[]
    }[],
    selected: number,
    categories: boolean,
    onChange: (id: number) => void
}

function Dropdown({ values, selected, categories, onChange }: DropdownProps) {
    // State variables
    const [selection, setSelection] = useState(selected);

    // Handler function
    function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const id = Number(event.currentTarget.value);
        setSelection(id);
        onChange(id);
    }

    // Create dropdown options
    let options;
    if (!categories) {
        options = values.map(category => (
            category.items.map(item =>
                <option key={item.id} value={item.id}>{item.name}</option>
            ))
        );
    } else {
        options = values.map(category => 
            <optgroup label={category.category} key={"category-" + category.category}>
                {/* Iterate through each item in this category: */}
                {category.items.map(item =>
                    <option key={item.id} value={item.id}>{item.name}</option>
                )}
            </optgroup>
        );
    }

    return(
        <div>
            <select
                onChange={e => handleChange(e)}
                value={selection}>
                <option disabled key={-1} value={-1}>Select an item</option>
                {options}
            </select> 
        </div>
    )
}

export default Dropdown;
