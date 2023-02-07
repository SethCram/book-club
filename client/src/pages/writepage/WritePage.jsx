import { useContext, useEffect, useRef, useState } from "react"
import "./WritePage.css"
import axios from "axios"
import { Context } from "../../context/Context";
import { imagesFolder } from "../settings/Settings"
import Multiselect from 'multiselect-react-dropdown'
import { ThemeContext } from "../../App";

//should be able to update picture, but no currently possible

export default function WritePage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [picture, setPicture] = useState(null);
    const [categories, setCategories] = useState([]);
    const { user } = useContext(Context);
    const multiSelectRef = useRef();
    const { theme } = useContext(ThemeContext);
 
    const handleSubmit = async (event) => {
        event.preventDefault();

        const newPost = {
            username: user.username,
            title: title,
            description: description,
        };

        if (picture) {
            const data = new FormData();
            const fileName = Date.now() + picture.name;

            data.append("name", fileName);
            data.append("file", picture);

            newPost.photo = imagesFolder + fileName;

            try {
                await axios.post("/upload", data);
            } catch (error) {
                
            }
        }
      
        if (multiSelectRef) {
          newPost.categories = multiSelectRef.current.getSelectedItems();
        }
      
        try {
            const response = await axios.post("/posts", newPost); // errors out here
            window.location.replace("/singlePostPage/" + response.data._id);
        } catch (error) {
          console.log(error);
        }
    };
    
    useEffect(() => {
      const getCategories = async () => {
        try {
          const storedCategories = await axios.get("/categories/");
          setCategories(storedCategories.data);
        } catch (error) {
        
        }
      }
      getCategories();
    }, [])
    
    return (
      <div className='writePage'>
          {picture && 
            <img 
              className="writeImg"
              src={URL.createObjectURL(picture)}
              alt=""
            />
          }
        <form className='writeForm' onSubmit={handleSubmit}>
          <div className='writeFormGroup'>
          <div className="writeMultiSelectContainer">
            <Multiselect
              isObject={true}
              displayValue="name" // Property name to display in the dropdown options
              options={categories}
              placeholder="Select categories..."
              selectionLimit={3}
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
                  <label htmlFor='fileInput'>
                    <i className="writeIcon fa-solid fa-plus"></i>
                  </label>
                  <input
                      type='file'
                      id='fileInput'
                      style={{ display: "none" }}
                      onChange={(event)=>setPicture(event.target.files[0])} //set picture to file uploaded
                  />
                  <input
                      className='writeInput'
                      type='text'
                      placeholder='Title'
                      autoFocus={true}
                      onChange={(event)=>setTitle(event.target.value)} //needa use event's curr txt box val
                  />
              </div>
              <div className="writeFormGroup">
                <textarea 
                    className="writeInput writeText" 
                    placeholder="Tell your story..." 
                    type="text"
                    onChange={(event)=>setDescription(event.target.value)}
                >
                </textarea>
              </div>
              <button className="writeSubmit" type="submit">Publish</button>
          </form>
    </div>
  )
}
