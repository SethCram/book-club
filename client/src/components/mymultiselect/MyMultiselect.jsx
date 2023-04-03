
import { useContext, useEffect, useState } from "react";
import "./MyMultiselect.css"
import Multiselect from 'multiselect-react-dropdown'
import { ThemeContext } from "../../App";
import axios from "axios";

export default function MyMultiselect({
    displayValue, options, setOptions, placeholderTxt,
    preSelectedOptions, selectionLimit, multiSelectRef
}) {
    const { theme } = useContext(ThemeContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOptions, setSelectedOptions] = useState([]);
    
    useEffect(() => {
        setSelectedOptions(preSelectedOptions);
    }, [preSelectedOptions]);

    useEffect(() => {
        console.log(selectedOptions);
    }, [selectedOptions]);

    const searchHook = (textBoxContents) => {
        setSearchTerm(textBoxContents);
    };

    const keyHook = async (event) => {
        //if pressed enter and 
        if (event.key === "Enter") {
            //stops form from being submitted
            event.preventDefault();

            let newSelectedOption;

            //if not too many items selected yet
            if (multiSelectRef.current.getSelectedItemsCount() < selectionLimit) {

                console.log(selectedOptions);

                //if searchterm isn't already an option
                if (!options.some(option => option.name === searchTerm)) {
                    try {
                        const response = await axios.post("/categories/", {
                            name: searchTerm
                        });
                        newSelectedOption = response.data;

                        //update dropdown options
                        setOptions(prevLocalOptions => [...prevLocalOptions, newSelectedOption]);

                        //update selected options
                        setSelectedOptions(prevSelectedOptions => [...prevSelectedOptions, newSelectedOption]);
                    } catch (error) {
                        console.log(error);
                    }
                }
                //if searchterm is an option + not already selected
                else if(!selectedOptions.some(selectedOption => selectedOption.name === searchTerm)) {
                    //find it
                    newSelectedOption = options.filter(option => option.name === searchTerm)[0];
                    //update selected options
                    setSelectedOptions(prevSelectedOptions => [...prevSelectedOptions, newSelectedOption]);
                }
            }

        }
    };

    const removeSelectedItemHook = (selectedList, removedItem) => {

        console.log(removedItem);

        //change selected options w/ deselect
        setSelectedOptions(selectedList);
    };

    const addSelectedItemHook = (selectedList, selectedItem) => {

        console.log(selectedList);

        //change selected options w/ select (clears out selectedItems? possibly bc ran when manually updated selected items)
        setSelectedOptions(prevSelectedOptions => [...prevSelectedOptions, selectedItem]);
    };

    return (
    <div className="myMultiSelect">
        <Multiselect
            isObject={true}
            displayValue={displayValue} // Property name to display in the dropdown options
            options={options}
            placeholder={placeholderTxt}
            selectionLimit={selectionLimit}
            selectedValues={selectedOptions}
            onSearch={searchTerm => searchHook(searchTerm)}
            onRemove={removeSelectedItemHook}
            onSelect={addSelectedItemHook}
            emptyRecordMsg={`No categories found. Press enter to create a new category named "${searchTerm}"`}
            showArrow
            showCheckbox
            avoidHighlightFirstOption
            ref={multiSelectRef}
            onKeyPressFn={keyHook}
            optionValueDecorator={element => (element + 1)}
            style={theme === "dark" ? { //Select styling CSS based on theme
                searchBox: {
                    border: 'none'
                },
                chips: {
                    'background': 'var(--color-gold)'
                },
                inputField: {
                    'color' : 'white'
                },
                optionContainer: {
                    'background': 'var(--color-bg-dark)'
                },
                circle: {
                    'color': 'black'
                }
                } : {
                searchBox: {
                    border: 'none'
                },
                chips: {
                    'background': 'var(--color-gold)'
                },  
            }}                                                  
        />
    </div>
  )
}
