import axios from "axios";
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar"
import SinglePost from "../../components/singlepost/SinglePost"
import "./SinglePostPage.css"

export default function SinglePostPage() {
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [updatedPostAuthor, setUpdatedPostAuthor] = useState(null);
  const location = useLocation();
  const postId = location.pathname.split("/")[2];

  //retrieve post according to postId
  useEffect(() => {
    const getPost = async () => {
      const response = await axios.get("/posts/" + postId);
      setPost(response.data);
    };
    getPost();   

  }, [postId])

  useEffect(() => {
    const getUser = async () => {
      if (post)
      {
        try {
          const response = await axios.get("/users/username/" + post.username);
          setUser(response.data);
        } catch (error) {
          //couldnt find user
        }
      }
    };
    getUser();
  }, [post])

  return (
    <div className='singlepostpage'>
      <SinglePost post={ post } setUpdatedPostAuthor={setUpdatedPostAuthor} />
      <Sidebar user={ user } updatedPostAuthor={updatedPostAuthor} />
    </div>
  )
}
