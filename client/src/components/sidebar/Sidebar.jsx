import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../../context/Context';
import './Sidebar.css'

export default function Sidebar({ user }) {
  const [categories, setCategories] = useState([]);
  //const { user } = useContext(Context);

  useEffect(() => {
    const getCategories = async () => {
      const response = await axios.get("/categories");
      setCategories(response.data);
    }
    getCategories();
  }, []) //shouldn't be updated all the time?

  return (
    <div className='sidebar'> 
        <div className='sidebarItem' >
          <span className='sidebarTitle'>ABOUT ME</span>
          <span>{user ? user.username : "No user found"}</span> 
          <img
            src={user?.profilePicture && user.profilePicture } 
            alt="" 
          />
          <p>
            { user?.bio && `"${user.bio}"` /*load bio in quotes if there is one*/} 
          </p>
        </div >
        
      <div className='sidebarItem'>
        {user && <span className='sidebarTitle'>CATEGORIES</span>}
          <ul className='sidebarList'>
            {user && categories.map((category, i) => (
              <Link className='link' to={`/?category=${category.name}`} key={i}>
                <li className='sidebarListItem'>{category.name}</li>
              </Link>
            ))}  
          </ul>
      </div>
      {user && 
        <div className='sidebarItem'>
          <span className='sidebarTitle'>FOLLOW AT</span>
          <div className='sidebarSocial'>
            <i className="sidebarIcon fa-brands fa-square-instagram"></i>
            <i className="sidebarIcon fa-brands fa-square-twitter"></i>
            <i className="sidebarIcon fa-brands fa-square-facebook"></i>
            <i className="sidebarIcon fa-brands fa-square-pinterest"></i>
          </div>
        </div>
      }
    </div >
  )
}
