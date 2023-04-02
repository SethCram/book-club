
import { useContext } from "react";
import "./MyMultiselect.css"
import Multiselect from 'multiselect-react-dropdown'
import { ThemeContext } from "../../App";

export default function MyMultiselect({ displayValue, options, placeholderTxt, preSelectedOptions, selectionLimit, multiSelectRef }) {
  const { theme } = useContext(ThemeContext);

    return (
      <div className="myMultiSelect">
        <Multiselect
            isObject={true}
            displayValue={displayValue} // Property name to display in the dropdown options
            options={options}
            placeholder={placeholderTxt}
            selectionLimit={selectionLimit}
            selectedValues={preSelectedOptions}
            showArrow
            showCheckbox
            avoidHighlightFirstOption
            ref={multiSelectRef}
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
