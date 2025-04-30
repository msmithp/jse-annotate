/** DropdownList.tsx * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * The DropdownList component is a list of variable length of dropdown menus,
 * each of which contains the same options. Each dropdown menu has an
 * associated "Delete" button to remove it from the list.
 * 
 * It takes a list of categories (each with its own values), a list of
 * the IDs of items currently selected, a flag for whether categories are
 * being used, a function that is called when any change occurs, and a function
 * that is called when any dropdown is removed from the list.
 */


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
        <div key={i} className="dropdownSelect">
            <Dropdown
                key={selection}
                values={values}
                selected={selection} 
                categories={categories}
                onChange={id => onChange(i, id)} />
            <button 
                key={"delete-" + selection}
                className="deleteButton"
                onClick={e => {
                    e.preventDefault();
                    onRemove(i);
                }}
                >Delete</button>
        </div>
    )

    return (
        <div className="dropdownList">
            {dropdownElements}
            <button 
                className="plusButton"
                onClick={e => {
                    e.preventDefault();
                    addDropdown();
            }}>+</button>
        </div>
    )
}

export default DropdownList;
