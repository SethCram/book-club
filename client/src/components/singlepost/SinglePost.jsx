import "./SinglePost.css"
import { Link } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { Context } from "../../context/Context";
import { imagesFolder } from "../../pages/settings/Settings";

export default function SinglePost({post}) {
    const { user } = useContext(Context);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [updateMode, setUpdateMode] = useState(false);
    const [picture, setPicture] = useState(null);

    //retrieve post according to postId
    useEffect(() => {
        const updateLocalPostFields = () => {
            //need for updating:
            setTitle(post?.title);        
            setDescription(post?.description);  
        };
        updateLocalPostFields();      

    }, [post]) //rerun when postId changes

    const handleDelete = async () => {
        try {
            await axios.delete(`/posts/${post._id}`, {
                data: { username: user.username }
            });
            window.location.replace("/"); // go to home page if post deleted
        } catch (error) {
            
        }
        
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        const updatedPost = {
            username: user.username,
            title,
            description
        };

        if (picture) {
            const data = new FormData();
            const fileName = Date.now() + picture.name;
            
            data.append("name", fileName);
            data.append("file", picture);

            updatedPost.photo = imagesFolder + fileName;

            try {
                await axios.post("/upload", data);
            } catch (error) {
                
            }
        }
        
        try {
            await axios.put("/posts/" + post._id, updatedPost);

            setUpdateMode(false); //dont needa update this way
        } catch (error) {
            
        }
    }

    const handlePictureDelete = async () => {
        
        //rm local picture and post's picture path
        setPicture(null);

        //if photo is attached to post, clear it
        if (post.photo)
        {
            post.photo = "";

            try {
                await axios.put("/posts/" + post._id, post);
            } catch (error) {
                
            }
        }

        //delete picture in file storage
    };

  return (
      <div className="singlePost">
          <div className="singlePostWrapper">
              {(post?.photo || picture)  && (
                <img
                    className="singlePostImg"
                    src={picture ? URL.createObjectURL(picture) : post?.photo}
                    alt="" 
                />
              )}

              {updateMode &&  //why can we use 'writeIcon' class here?
                <div className="singlePostPictureIcons">
                    <label htmlFor='fileInput'>
                        <i className="singlePostPictureIcon fa-solid fa-plus"/>
                    </label>
                    <input
                        type='file'
                        id='fileInput'
                        style={{ display: "none" }}
                        onChange={(event)=>setPicture(event.target.files[0])} //set picture to file uploaded
                    />
                    {(picture || post.photo) && <i className="singlePostPictureIcon fa-regular fa-trash-can" onClick={handlePictureDelete}/>}
                </div>
              }

              
              {updateMode ?
                <input type="text"
                    value={title}
                    className="singlePostTitleInput"
                    autoFocus={true} 
                    onChange={(event)=>setTitle(event.target.value)}
                /> : 
                  <h1 className="singlePostTitle">
                    {title}
                    {post?.username === user?.username && // ? indicates only do comparison if user != null
                        <div className="singlePostIcons">
                            <i className="singlePostIcon fa-regular fa-pen-to-square" onClick={()=>setUpdateMode(true)}></i>
                            <i className="singlePostIcon fa-regular fa-trash-can" onClick={handleDelete}></i>
                        </div>
                    }
                </h1>
              }
                  
              
              <div className="singlePostInfo">
                  <span className="singlePostAuthor">
                      Author:
                      <Link className="link" to={`/?username=${post?.username}`}>
                          <b>
                            {post?.username /* needa use ? for as long as post is passed in, since it's retrieved via async funct */ }
                          </b>
                      </Link>
                  </span>
                  <span className="singlePostDate">Published: <b>{new Date(post?.createdAt).toDateString()}</b></span>
              </div>
              {updateMode ?
                <input
                    type="text"
                    value={description}
                    className="singlePostDescriptionInput" 
                    onChange={(event)=>setDescription(event.target.value)}
                /> :
                <p className="singlePostDescription">
                    {description}
                </p>
              }
              {updateMode && 
                <button
                  className="singlePostUpdateButton"
                  onClick={handleUpdate}
                >
                    Update
                </button>
              }
          </div>
      </div>
  )
}
