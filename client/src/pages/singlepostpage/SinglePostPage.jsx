import axios from "axios";
import { useState, useEffect} from "react"
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar"
import SinglePost from "../../components/singlepost/SinglePost"
import "./SinglePostPage.css"

export default function SinglePostPage() {
  const [post, setPost] = useState(null);
  const [sidebarUser, setSidebarUser] = useState(null);
  const [updatedPostAuthor, setUpdatedPostAuthor] = useState(null);
  const location = useLocation();
  const postId = location.pathname.split("/")[2];

  //retrieve post according to postId
  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get("/api/posts/" + postId);
        setPost(response.data);
      } catch (error) {
        
      }
    };
    getPost();   

  }, [postId])

  useEffect(() => {
    const getUser = async () => {
      if (post)
      {
        try {
          const response = await axios.get("/api/users/username/" + post.username);

          //if the retrieved username isn't the local username
          //if (response.data.username !== user?.username) {
            //set new sidebar user
            setSidebarUser(response.data);
          //}

        } catch (error) {
          //couldnt find user
        }
      }
    };
    getUser();
  }, [post])

  useEffect(() => {
    //if post author was actually updated, update it in the sidebar
    if (updatedPostAuthor?.username === post?.username) {
      setSidebarUser(updatedPostAuthor)
    }
  }, [updatedPostAuthor, post]);

  return (
    <div className='singlepostpage'>
      <SinglePost post={ post } setUpdatedPostAuthor={setUpdatedPostAuthor} />
      <Sidebar sidebarUser={sidebarUser} />
    </div>
  )
}
