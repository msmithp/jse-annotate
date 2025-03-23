import Dropdown from "./Dropdown"


interface DropdownListProps {
    values: {
        category: string,
        items: {
            id: number,
            name: string
        }[]
    }[],
    selections: number[],
    categories: boolean,
    onChange: (index: number, value: number) => void,
    onRemove: (index: number) => void
}


function DropdownList({ values, selections, categories, onChange, onRemove }: DropdownListProps) {
    // Event handlers
    function addDropdown() {
        // Append a -1 (empty dropdown) to the dropdown list
        onChange(selections.length, -1);
    }

    const dropdownElements = selections.map((selection, i) =>
        <div key={i} style={{display: "flex"}}>
            <Dropdown
                key={selection}
                values={values}
                selected={selection} 
                categories={categories}
                onChange={id => onChange(i, id)} />
            <button 
                key={"delete-" + selection}
                onClick={e => {
                    e.preventDefault();
                    onRemove(i);
                }}
                >Delete</button>
        </div>
    )

    return (
        <div>
            {dropdownElements}
            <button onClick={e => {
                e.preventDefault();
                addDropdown();
            }}>+</button>
        </div>
    )
}

export default DropdownList;
