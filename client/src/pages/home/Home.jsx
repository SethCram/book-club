import { useEffect, useState } from "react"
import Header from '../../components/header/Header'
import Posts from '../../components/posts/Posts'
import Sidebar from '../../components/sidebar/Sidebar'
import './Home.css'
import axios from "axios"
import { useLocation } from "react-router-dom"

export default function Home() {
  const [posts, setPosts] = useState([]); //init arr empty bc no data fetched (state var)
  const {search} = useLocation(); //just take search prop of location

  useEffect(() => { //cant detch data in here since using sync funct
    const fetchPosts = async () => {
      const response = await axios.get("/posts" + search);
      //console.log(response); //make response show in dev logs in browser
      setPosts(response.data);
    }
    fetchPosts();

  }, [search]) //only runs code everytime search changes

  return (
    <div>
        <Header />
        <div className='home'>
          <Posts posts={ posts } />
          <Sidebar/>
        </div>
    </div>
      
  )
}
