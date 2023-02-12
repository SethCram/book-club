import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SocialMediaIcons from '../socialmediaicons/SocialMediaIcons';
import './Sidebar.css'

export default function Sidebar({ user }) {
  const [categories, setCategories] = useState([]);
  const anyUserLinksSet = user && (user.instagramLink ||
    user.twitterLink ||
    user.facebookLink ||
    user.pinterestLink);

  useEffect(() => {
    const getCategories = async () => {
      const response = await axios.get("/categories");
      setCategories(response.data);
    }
    getCategories();
  }, []) //shouldn't be updated ever? (if empty, constantly updates)

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
      {user &&
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
      }
      {anyUserLinksSet &&
        <div className='sidebarItem'>
          <span className='sidebarTitle'>FOLLOW AT</span>
          <div className='sidebarSocial'>
            <SocialMediaIcons user={user} barPosition="side"/>
          </div>
        </div>
      }
    </div >
  )
}
