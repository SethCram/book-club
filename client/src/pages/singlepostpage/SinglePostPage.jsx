import axios from "axios";
import { useState, useEffect, useContext } from "react"
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar"
import SinglePost from "../../components/singlepost/SinglePost"
import "./SinglePostPage.css"
import { Context } from "../../context/Context";

export default function SinglePostPage() {
  const [post, setPost] = useState(null);
  const [sidebarUser, setSidebarUser] = useState(null);
  const [updatedPostAuthor, setUpdatedPostAuthor] = useState(null);
  const location = useLocation();
  const postId = location.pathname.split("/")[2];
  const { user } = useContext(Context);

  //retrieve post according to postId
  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get("/posts/" + postId);
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
          const response = await axios.get("/users/username/" + post.username);

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

  return (
    <div className='singlepostpage'>
      <SinglePost post={ post } setUpdatedPostAuthor={setUpdatedPostAuthor} />
      {/* Why would user be displayed if sidebar user null?? */}
      <Sidebar user={sidebarUser} updatedPostAuthor={updatedPostAuthor} />
    </div>
  )
}
