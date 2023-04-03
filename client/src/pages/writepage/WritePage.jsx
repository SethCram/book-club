import { useContext, useEffect, useRef, useState } from "react"
import "./WritePage.css"
import axios from "axios"
import { Context } from "../../context/Context";
import Editor from "../../components/editor/Editor";
import { useNavigate } from "react-router-dom";
import MyMultiselect from "../../components/mymultiselect/MyMultiselect";

//should be able to update picture, but no currently possible

export default function WritePage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [picture, setPicture] = useState(null);
    const [categories, setCategories] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const { user } = useContext(Context);
    const multiSelectRef = useRef();
    const navigate = useNavigate();
  
    const emptyArr = [];
 
    const handleSubmit = async (event) => {
      event.preventDefault();
      
      setErrorMsg("");

      if (!description) {
        setErrorMsg("The description is required to create a post.");
        return;
      }

        const newPost = {
            username: user.username,
            title: title,
            description: description,
        };
      
      //console.log(picture);

        if (picture) {
            const data = new FormData();
            const fileName = Date.now() + picture.name;

            data.append("name", fileName);
            data.append("file", picture);

            try {
              const response = await axios.post("/upload", data);
              newPost.photo = response.data.url;
            } catch (error) {
              console.log(error);
            }
        }
      
        if (multiSelectRef) {
          newPost.categories = multiSelectRef.current.getSelectedItems();
        }
      
        try {
          const response = await axios.post("/posts", newPost); 
          navigate("/singlePostPage/" + response.data._id);

        } catch (error) {
          console.log(error);
          setErrorMsg(error.response.data.message);
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
            <MyMultiselect
              displayValue={"name"}
              setOptions={setCategories}
              options={categories}
              preSelectedOptions={emptyArr}
              placeholderTxt="Select categories..."
              selectionLimit={3}
              multiSelectRef={multiSelectRef}
            />
            <div className="writeFormRow">
              <div className="writeIconWrapper">
                <label htmlFor='fileInput'>
                  <i className="writeIcon fa-solid fa-plus"></i>
                </label>
              </div>
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
                  required
                />
            </div>
          </div>
          {errorMsg &&
            <span className="writeFormErrorMsg">
              <div className="responseMsg errorText">{errorMsg}</div>
            </span>
          }
          
          <div className="writeFormGroup writeFormEditor">
            <Editor setDescription={setDescription}/>
          </div>
          <button className="writeSubmit" type="submit">Publish</button>
        </form>
    </div>
  )
}
