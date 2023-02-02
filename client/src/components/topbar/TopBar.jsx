import { useContext } from "react";
import { Link } from "react-router-dom";
import { LoginFailure } from "../../context/Actions";
import { Context } from "../../context/Context";
import SocialMediaIcons from "../socialmediaicons/SocialMediaIcons";
import "./TopBar.css"

export default function TopBar() {
    const { user, dispatch } = useContext(Context);

    const handleLogout = () => {
        dispatch(LoginFailure());
    };

    return (
      <div className='topbar'>
        <div className="topLeft">
            <SocialMediaIcons user={user} barPosition="top"/>
          </div>
          <div className="topCenter">
              <ul className="topList">
                    <li className="topListItem">
                        <Link to="/" className="link">HOME</Link>
                    </li>
                    <li className="topListItem">
                        <Link to="/about" className="link">ABOUT</Link>
                    </li>
                    <li className="topListItem">
                        <Link to="/contact" className="link">CONTACT</Link>
                    </li>
                    <li className="topListItem">
                        <Link to="/writepage" className="link">WRITE</Link>
                    </li>
                    <li className="topListItem">
                        {user && <Link to="/" onClick={handleLogout} className="link">LOGOUT</Link> }
                    </li>
              </ul>
          </div>
            <div className="topRight">
                {
                    user ? (
                        /* need a link here to settings */
                        <Link to="/settings" className="link">
                        <img
                            className="topImg"
                            src={user.profilePicture}
                            alt=""
                            />
                        </Link>
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
          </div>
      </div>
  )
}
