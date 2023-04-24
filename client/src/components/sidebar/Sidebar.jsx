import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReputationIcon from '../reputationIcon/ReputationIcon';
import SocialMediaIcons from '../socialmediaicons/SocialMediaIcons';
import './Sidebar.css'
import { getAxiosAuthHeaders } from '../../App';
import { Context } from '../../context/Context';

export default function Sidebar({ sidebarUser }) {
  const [categoriesCount, setCategoriesCount] = useState([]);
  const anyUserLinksSet = sidebarUser && (sidebarUser.instagramLink ||
    sidebarUser.twitterLink ||
    sidebarUser.facebookLink ||
    sidebarUser.pinterestLink);
  const contextObj = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const getPosts = async (howMany) => {
      const response = await axios.get(`/posts/sum/sum/?username=${sidebarUser.username}&&sumBy=category&&count=${howMany}`);
      setCategoriesCount(response.data.categoriesCount);
    }
    const USER_CATS = 6;
    if (sidebarUser) {
      getPosts(USER_CATS);
    }
  }, [sidebarUser])

  const handleDeleteAccount = async () => {

    try {

      const [axiosAuthHeaders, _] = await getAxiosAuthHeaders(contextObj.user, contextObj.dispatch);

      await axios.delete("/users/" + sidebarUser._id,
        {
          data: { userId: sidebarUser._id, username: sidebarUser.username },
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
          <i className="sidebarTrashIcon fa-regular fa-trash-can" onClick={handleDeleteAccount}></i>
        </div>
      }
      <div className='sidebarItem' >
        <span className='sidebarTitle'>
          ABOUT ME
        </span>
          <span className='sidebarReputation'> 
          <ReputationIcon
            repScore={sidebarUser?.reputation}
            user={sidebarUser}
            fromSideBar={true}
          />
            {sidebarUser ? sidebarUser.username : "No user found"}
          </span> 
          <img
            src={sidebarUser?.profilePicture && sidebarUser.profilePicture } 
            alt="" 
          />
          <p>
            { sidebarUser?.bio && `"${sidebarUser.bio}"` /*load bio in quotes if there is one*/} 
          </p>
        </div >
      {categoriesCount.length !== 0 &&
        <div className='sidebarItem'>
          <span className='sidebarTitle'>CATEGORIES</span>
          <ul className='sidebarList'>
            {categoriesCount.map((categoryCount, i) => (
              <li className='sidebarListItem' key={i}>
                <Link className='link' to={`/?category=${categoryCount._id}&&username=${sidebarUser.username}`} >
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
            <SocialMediaIcons user={sidebarUser} barPosition="side"/>
          </div>
        </div>
      }
    </div >
  )
}
