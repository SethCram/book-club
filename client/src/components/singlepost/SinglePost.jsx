import "./SinglePost.css"
import { Link, useLocation } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { Context } from "../../context/Context";

export default function SinglePost({post}) {
    const { user } = useContext(Context);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [updateMode, setUpdateMode] = useState(false);

    //retrieve post according to postId
    useEffect(() => {
        const updatePostFields = () => {
            //need for updating:
            setTitle(post?.title);        
            setDescription(post?.description);  
        };
        updatePostFields();      

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

    const handleUpdate = async () => {
        try {
            await axios.put("/posts/" + post._id, {
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
              {post?.photo && (
                <img
                    className="singlePostImg"
                    src={post.photo}
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
