import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReputationIcon from '../reputationIcon/ReputationIcon';
import SocialMediaIcons from '../socialmediaicons/SocialMediaIcons';
import './Sidebar.css'
import { getAxiosAuthHeaders } from '../../App';
import { Context } from '../../context/Context';

export default function Sidebar({ user, updatedPostAuthor = null }) {
  const [categoriesCount, setCategoriesCount] = useState([]);
  const anyUserLinksSet = user && (user.instagramLink ||
    user.twitterLink ||
    user.facebookLink ||
    user.pinterestLink);
  const contextObj = useContext(Context);
  const navigate = useNavigate();

  console.log(user);

  //shouldn't be updated ever? (if empty, constantly updates)

  useEffect(() => {
    const getPosts = async (howMany) => {
      const response = await axios.get(`/posts/sum/sum/?username=${user.username}&&sumBy=category&&count=${howMany}`);
      setCategoriesCount(response.data.categoriesCount);
    }
    const USER_CATS = 6;
    if (user) {
      getPosts(USER_CATS);
    }
  }, [user])

  const handleDeleteAccount = async () => {

    try {

      const [axiosAuthHeaders, _] = await getAxiosAuthHeaders(contextObj.user, contextObj.dispatch);

      await axios.delete("/users/" + user._id,
        {
          data: { userId: user._id, username: user.username },
          headers: axiosAuthHeaders.headers
        }
      );

      navigate("/");

    } catch (error) {

    }
    
  };

  return (
    <div className='sidebar'>
      {contextObj?.user?.isAdmin &&
        <div div className='sidebarItem' >
          <i className="sidebarTrashIcon reddishBrown fa-regular fa-trash-can" onClick={handleDeleteAccount}></i>
        </div>
      }
      <div className='sidebarItem' >
        <span className='sidebarTitle'>
          ABOUT ME
        </span>
          <span className='sidebarReputation'> 
          <ReputationIcon
            repScore={
              (updatedPostAuthor && updatedPostAuthor.username !== user.username)
                ?
                updatedPostAuthor.reputation
                :
                user?.reputation
            }
            user={
              (updatedPostAuthor && updatedPostAuthor.username !== user.username)
                ?
                updatedPostAuthor
                :
                user
            }
            fromSideBar={true}
          />
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
