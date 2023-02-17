import { useContext } from "react";
import { Link } from "react-router-dom";
import { LoginFailure } from "../../context/Actions";
import { Context } from "../../context/Context";
import SocialMediaIcons from "../socialmediaicons/SocialMediaIcons";
import ReactSwitch from 'react-switch'
import "./TopBar.css"
import { ThemeContext } from "../../App";
import BC from "../../assets/favicon_io/android-chrome-512x512.png"

export default function TopBar() {
    const { user, dispatch } = useContext(Context);

    const { theme, toggleTheme } = useContext(ThemeContext);

    const handleLogout = () => {
        dispatch(LoginFailure());
    };

    return (
      <div className='topbar'>
        <div className="topLeft">
            <div className="topTitle">
                <img className="topTitleImage" src={BC} alt=""/>
                Book Club
            </div>
            <SocialMediaIcons user={user} barPosition="top" />
          </div>
          <div className="topCenter">
              <ul className="topList">
                    <li className="topListItem">
                        <Link to="/" className="link">HOME</Link>
                    </li>
                    {user &&
                        <li className="topListItem">
                            <Link to={`/?username=${user.username}`} className="link">MY POSTS</Link>
                        </li>
                    }
                    <li className="topListItem">
                        <Link to="/writepage" className="link">WRITE</Link>
                    </li>
                    <li className="topListItem">
                        <Link to="/about" className="link">ABOUT</Link>
                    </li>
                    {user &&
                        <li className="topListItem">
                            <Link to="/" onClick={handleLogout} className="link">LOGOUT</Link> 
                        </li>
                    }
              </ul>
          </div>
            <div className="topRight">
                {
                    user ? (
                        <>
                            <div className="topListReputation">
                                <span className="fa-stack fa-xl">
                                    <i className="fa-solid fa-star fa-xl"></i>
                                    <span className="fa fa-stack-1x">
                                        <span className="topListReputationNumber">
                                            {user.reputation}
                                        </span>
                                    </span>
                                </span>
                            </div>
                            <Link to="/settings" className="link">
                                <img
                                    className="topImg"
                                    src={user.profilePicture}
                                    alt=""
                                />
                            </Link>
                        </>
                    ) : (
                        <ul className="topList">
                            <li className="topListItem">
                                <Link to="/login" className="link">LOGIN</Link>
                            </li>
                            <li className="topListItem">
                                <Link to="/register" className="link">REGISTER</Link>
                            </li>
                        </ul>
                    )
                }
              <i className="topSearchIcon fa-solid fa-magnifying-glass"></i>
                <div className="topSwitch">
                    <ReactSwitch
                        onChange={toggleTheme}
                        checked={theme === "dark"} 
                        onColor="#86d3ff" 
                        onHandleColor="#2693e6"
                        handleDiameter={30}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={20}
                        width={48}
                    />
                </div>
          </div>
      </div>
  )
}
