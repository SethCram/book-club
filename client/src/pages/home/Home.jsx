import { useEffect, useState } from "react"
import Header from '../../components/header/Header'
import Posts from '../../components/posts/Posts'
import Sidebar from '../../components/sidebar/Sidebar'
import './Home.css'
import axios from "axios"
import { useLocation } from "react-router-dom"

export default function Home() {
  const [posts, setPosts] = useState([]); //init arr empty bc no data fetched (state var)
  const { search } = useLocation(); //just take search prop of location
  const [user, setUser] = useState(null);
  const userSearchType = search?.split("=")[0] === "?username";
  const username = search?.split("=")[1];

  useEffect(() => { //cant detch data in here since using sync funct
    const fetchPosts = async () => {
      const response = await axios.get("/posts" + search);
      //console.log(response); //make response show in dev logs in browser
      setPosts(response.data);
    }
    fetchPosts();

  }, [search]) //only runs code everytime search changes

  //retrieve user according to username
  useEffect(() => {
    const getUser = async () => { 
      //only set user if the search type is requesting them
      if (userSearchType)
      {
        try {
          const response = await axios.get("/users/username/" + username);
          setUser(response.data);
        } catch (error) {
          //notify requester that username was changed/user deleted
        }
      }
    };
    getUser();      

  }, [username]) //run everytime username changes

  return (
    <div>
        <Header />
        <div className='home'>
          <Posts posts={ posts } />
          {userSearchType && <Sidebar user={user} /> }
        </div>
    </div>
      
  )
}
