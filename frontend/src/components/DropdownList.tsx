import Dropdown from "./Dropdown"


interface DropdownListProps {
    // Format of `values`: {category, [list_of_skill_dictionaries]}
    values: {[category: string]: {
        id: number,
        name: string
    }[]},
    selections: number[],
    onChange: (index: number, value: number) => void,
    onRemove: (index: number) => void
}


function DropdownList({ values, selections, onChange, onRemove }: DropdownListProps) {
    // Event handlers
    function addDropdown() {
        // Append a -1 (empty dropdown) to the dropdown list
        onChange(selections.length, -1);
    }

    const dropdownElements = selections.map((selection, i) =>
        <div key={i}>
            <Dropdown
                key={selection}
                values={values}
                selected={selection} 
                onChange={id => onChange(i, id)} />
            <button 
                key={"delete-" + selection}
                onClick={e => {
                    e.preventDefault();
                    onRemove(i);
                }}>Delete</button>
        </div>
    )

    return (
        <div>
            {dropdownElements}
            <button onClick={e => {
                e.preventDefault();
                addDropdown();
            }}>Add a skill</button>
        </div>
    )
}

export default DropdownList;
