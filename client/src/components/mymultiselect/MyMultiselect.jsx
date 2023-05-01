
import { useContext, useEffect, useState } from "react";
import "./MyMultiselect.css"
import Multiselect from 'multiselect-react-dropdown'
import { ThemeContext, getAxiosAuthHeaders } from "../../App";
import axios from "axios";
import { Context } from "../../context/Context";

export default function MyMultiselect({
    displayValue, options, setOptions, placeholderTxt,
    preSelectedOptions, selectionLimit, multiSelectRef,
    setErrorMsg
}) {
    const { theme } = useContext(ThemeContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [categoriesCount, setCategoriesCount] = useState([]);
    const { user, dispatch } = useContext(Context);
    
    useEffect(() => {
        setSelectedOptions(preSelectedOptions);
    }, [preSelectedOptions]);

    useEffect(() => {
        const countPostsByCats = async () => {
            
            const response = await axios.get(`/posts/sum/sum/?sumBy=category`);  
            
            //console.log(response.data.categoriesCount);
            
            setCategoriesCount(response.data.categoriesCount);
        }
        countPostsByCats();
        
    }, [])

    const searchHook = (textBoxContents) => {
        setSearchTerm(textBoxContents);
    };

    const keyHook = async (event) => {
        //if pressed enter and 
        if (event.key === "Enter") {
            //stops form from being submitted
            event.preventDefault();

            //if string has any whitespace in it
            if (searchTerm && /\s/g.test(searchTerm)) {
                setErrorMsg("Categories can't contain spaces.");
                return;
            }

            //if not too many items selected yet
            if (multiSelectRef.current.getSelectedItemsCount() < selectionLimit) {

                let newSelectedOption;

                //if searchterm isn't already an option
                if (!options.some(option => option.name === searchTerm)) {
                    try {

                        const [axiosAuthHeaders, _] = await getAxiosAuthHeaders(user, dispatch);
                    
                        const response = await axios.post("/categories/",
                            {
                            name: searchTerm
                            },
                            axiosAuthHeaders
                        );
                        newSelectedOption = response.data;

                        //update dropdown options
                        setOptions(prevLocalOptions => [...prevLocalOptions, newSelectedOption]);

                        //update selected options
                        setSelectedOptions(prevSelectedOptions => [...prevSelectedOptions, newSelectedOption]);
                    } catch (error) {
                        //console.log(error);
                    }
                }
                //if searchterm is an option + not already selected
                else if(!selectedOptions.some(selectedOption => selectedOption.name === searchTerm)) {
                    //find it
                    newSelectedOption = options.find(option => option.name === searchTerm);
                    //update selected options
                    setSelectedOptions(prevSelectedOptions => [...prevSelectedOptions, newSelectedOption]);
                }
            }

        }
    };

    const removeSelectedItemHook = (selectedList, removedItem) => {

        //console.log(removedItem);

        //change selected options w/ deselect
        setSelectedOptions(selectedList);
    };

    const addSelectedItemHook = (selectedList, selectedItem) => {

        //console.log(selectedList);

        //change selected options w/ select (clears out selectedItems? possibly bc ran when manually updated selected items)
        setSelectedOptions(prevSelectedOptions => [...prevSelectedOptions, selectedItem]);
    };

    //Display each option alongside the number of posts tagged by it
    const optionDisplay = (option) => {
        if (categoriesCount.length > 0 && option) {
            const catCount = categoriesCount.find(categoryCount => categoryCount._id === option);
            
            let postsTaggedWithCat;

            if (catCount) {
                postsTaggedWithCat = catCount.count;
            }
            else {
                postsTaggedWithCat = 0;
            }
            
            return postsTaggedWithCat + " " + option
        }
    }

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
            optionValueDecorator={optionDisplay}
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
