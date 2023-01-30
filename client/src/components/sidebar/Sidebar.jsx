import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../../context/Context';
import { imagesFolder } from '../post/Post';
import './Sidebar.css'

export default function Sidebar() {
  const [categories, setCategories] = useState([]);
  const { user } = useContext(Context);

  useEffect(() => {
    const getCategories = async () => {
      const response = await axios.get("/categories");
      setCategories(response.data);
    }
    getCategories();
  }) //shouldn't be updated all the time?

  return (
    <div className='sidebar'>
          <div className='sidebarItem'>
              <span className='sidebarTitle'>ABOUT ME</span>
              <span>{user?.username}</span>
              <img
                src={imagesFolder + user?.profilePicture} //"https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                alt="" 
              />
              <p>
                "{user?.bio}"
              </p>
          </div>
          <div className='sidebarItem'>
              <span className='sidebarTitle'>CATEGORIES</span>
              <ul className='sidebarList'>
                {categories.map((category, i) => (
                  <Link className='link' to={`/?category=${category.name}`} key={i}>
                    <li className='sidebarListItem'>{category.name}</li>
                  </Link>
                ))}  
              </ul>
          </div>
          <div className='sidebarItem'>
              <span className='sidebarTitle'>FOLLOW AT</span>
              <div className='sidebarSocial'>
                <i className="sidebarIcon fa-brands fa-square-instagram"></i>
                <i className="sidebarIcon fa-brands fa-square-twitter"></i>
                <i className="sidebarIcon fa-brands fa-square-facebook"></i>
                <i className="sidebarIcon fa-brands fa-square-pinterest"></i>
              </div>
          </div>
    </div>
  )
}
