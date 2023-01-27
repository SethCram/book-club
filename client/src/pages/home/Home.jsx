import { useEffect, useState } from "react"
import Header from '../../components/header/Header'
import Posts from '../../components/posts/Posts'
import Sidebar from '../../components/sidebar/Sidebar'
import './Home.css'
import axios from "axios"

export default function Home() {
  const [posts, setPosts] = useState([]); //init arr empty bc no data fetched (state var)

  useEffect(() => { //cant detch data in here since using sync funct
    const fetchPosts = async () => {
      const response = await axios.get("/posts");
      //console.log(response); //make response show in dev logs in browser
      setPosts(response.data);
    }
    fetchPosts();

  }, []) //empty, so only runs once at the beginning
  

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
