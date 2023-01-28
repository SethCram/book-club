import "./SinglePost.css"
import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { postFolder } from "../post/Post";

export default function SinglePost() {
    const location = useLocation(); //get the location followed to reach this comp
    const postId = location.pathname.split("/")[2]; //get the post id
    const [post, setPost] = useState([]);

    //retrieve post according to postId
    useEffect(() => {
        const getPost = async () => {
        const response = await axios.get("/posts/" + postId);
        setPost(response.data);
        };
        getPost();

    }, [postId]) //rerun when postId changes

  return (
      <div className="singlePost">
          <div className="singlePostWrapper">
              {post.photo && (
                <img
                    className="singlePostImg"
                    src={postFolder + post.photo}
                    alt="" 
                />
              )}
              <h1 className="singlePostTitle">
                  {post.title}
                  <div className="singlePostIcons">
                      <i className="singlePostIcon fa-regular fa-pen-to-square"></i>
                      <i className="singlePostIcon fa-regular fa-trash-can"></i>
                  </div>
              </h1>
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
              <p className="singlePostDescription">
                {post.description}
              </p>
          </div>
      </div>
  )
}
