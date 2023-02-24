import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReputationIcon from '../reputationIcon/ReputationIcon';
import SocialMediaIcons from '../socialmediaicons/SocialMediaIcons';
import './Sidebar.css'

export default function Sidebar({ user }) {
  const [categoriesCount, setCategoriesCount] = useState([]);
  const anyUserLinksSet = user && (user.instagramLink ||
    user.twitterLink ||
    user.facebookLink ||
    user.pinterestLink);

 //shouldn't be updated ever? (if empty, constantly updates)

  useEffect(() => {
    const getPosts = async (howMany) => {
      
      const response = await axios.get(`/posts/sum/sum/?username=${user.username}&&sumBy=category&&count=${howMany}`);  
      setCategoriesCount(response.data.categoriesCount);
      //const topUserCats = response.data.categoryCount.map((value, index) => value._id);
      //console.log(topUserCats);
      //setCategories(topUserCats);
    }
    const USER_CATS = 6;
    if (user) {
      getPosts(USER_CATS);
    }
  }, [user])
  

  return (
    <div className='sidebar'> 
        <div className='sidebarItem' >
          <span className='sidebarTitle'>ABOUT ME</span>
          <span className='sidebarReputation'> 
          <ReputationIcon repScore={user?.reputation} user={user} fromSideBar={true} />
            {user ? user.username : "No user found"}
          </span> 
          <img
            src={user?.profilePicture && user.profilePicture } 
            alt="" 
          />
          <p>
            { user?.bio && `"${user.bio}"` /*load bio in quotes if there is one*/} 
          </p>
        </div >
      {categoriesCount.length !== 0 &&
        <div className='sidebarItem'>
          <span className='sidebarTitle'>CATEGORIES</span>
          <ul className='sidebarList'>
            {categoriesCount.map((categoryCount, i) => (
              <li className='sidebarListItem' key={i}>
                <Link className='link' to={`/?category=${categoryCount._id}&&username=${user.username}`} >
                  {categoryCount.count} {categoryCount._id}
                </Link>
              </li>
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
