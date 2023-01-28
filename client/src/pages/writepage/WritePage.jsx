import { useContext, useState } from "react"
import "./WritePage.css"
import axios from "axios"
import { Context } from "../../context/Context";

export default function WritePage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [picture, setPicture] = useState(null);
    const { user } = useContext(Context);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newPost = {
            username: user.username,
            title: title,
            description,
        };

        if (picture) {
            const data = new FormData();
            const fileName = Date.now() + picture.name;

            data.append("name", fileName);
            data.append("file", picture);

            newPost.photo = fileName;

            try {
                await axios.post("/upload", data);
            } catch (error) {
                
            }
        }
        try {
            const response = await axios.post("/posts", newPost); // errors out here
            window.location.replace("/singlePostPage/" + response.data._id);
        } catch (error) {
            console.log(error);
        }
    };

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
                  <label htmlFor='fileInput'>
                    <i className="writeIcon fa-solid fa-plus"></i>
                  </label>
                  <input
                      type='file'
                      id='fileInput'
                      style={{ display: "none" }}
                      onChange={event=>setPicture(event.target.files[0])} //set picture to file uploaded
                  />
                  <input
                      className='writeInput'
                      type='text'
                      placeholder='Title'
                      autoFocus={true}
                      onChange={event=>setTitle(event.target.title)}
                  />
              </div>
              <div className="writeFormGroup">
                <textarea 
                    className="writeInput writeText" 
                    placeholder="Tell your story..." 
                    type="text"
                    onChange={event=>setDescription(event.target.description)}
                >
                </textarea>
              </div>
              <button className="writeSubmit" type="submit">Publish</button>
          </form>
    </div>
  )
}
