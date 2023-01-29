import "./SinglePost.css"
import { Link, useLocation } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { imagesFolder } from "../post/Post";
import { Context } from "../../context/Context";

export default function SinglePost() {
    const location = useLocation(); //get the location followed to reach this comp
    const postId = location.pathname.split("/")[2]; //get the post id
    const [post, setPost] = useState([]);
    const { user } = useContext(Context);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [updateMode, setUpdateMode] = useState(false);

    //retrieve post according to postId
    useEffect(() => {
        const getPost = async () => {
            const response = await axios.get("/posts/" + postId);
                
            setPost(response.data);
            //need for updating:
            setTitle(response.data.title);        
            setDescription(response.data.description);  
        };
        getPost();      

    }, [postId]) //rerun when postId changes

    const handleDelete = async () => {
        try {
            await axios.delete(`/posts/${postId}`, {
                data: { username: user.username }
            });
            window.location.replace("/"); // go to home page if post deleted
        } catch (error) {
            
        }
        
    };

    const handleUpdate = async () => {
        try {
            await axios.put("/posts/" + postId, {
                username: user.username,
                title,
                description
            });
            //window.location.reload(); //reload updated page
            setUpdateMode(false); //dont needa update this way
        } catch (error) {
            
        }
    }

  return (
      <div className="singlePost">
          <div className="singlePostWrapper">
              {post.photo && (
                <img
                    className="singlePostImg"
                    src={imagesFolder + post.photo}
                    alt="" 
                />
              )}
              
              {updateMode ?
                <input type="text"
                    value={title}
                    className="singlePostTitleInput"
                    autoFocus="true" 
                    onChange={(event)=>setTitle(event.target.value)}
                /> : 
                  <h1 className="singlePostTitle">
                    {title}
                    {post.username === user?.username && // ? indicates only do comparison if user != null
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
                      <Link className="link" to={`/?username=${post.username}`}>
                          <b>
                            {post.username}
                          </b>
                      </Link>
                  </span>
                  <span className="singlePostDate">Published: <b>{new Date(post.createdAt).toDateString()}</b></span>
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
