import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'

export default function Sidebar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const response = await axios.get("/categories");
      setCategories(response.data);
    }
    getCategories();
  })

  return (
    <div className='sidebar'>
          <div className='sidebarItem'>
              <span className='sidebarTitle'>ABOUT ME</span>
              <img
                  src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                  alt="" 
                  />
              <p>
                  "Exploring the world one adventure at a time.
                  Lover of good food, great company, and endless possibilities.
                  Join me on my journey and let's make memories together. #travel #foodie #adventureseeker"
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
