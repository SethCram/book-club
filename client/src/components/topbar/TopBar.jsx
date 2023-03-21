import { useContext } from "react";
import { Link } from "react-router-dom";
import { LoginFailure } from "../../context/Actions";
import { Context } from "../../context/Context";
import SocialMediaIcons from "../socialmediaicons/SocialMediaIcons";
import ReactSwitch from 'react-switch'
import "./TopBar.css"
import { DeviceType, GetDeviceType, ThemeContext } from "../../App";
import BC from "../../assets/favicon_io/android-chrome-512x512.png"
import ReputationIcon from "../reputationIcon/ReputationIcon";
import { fallDown as Menu } from 'react-burger-menu'

export default function TopBar() {
    const { user, dispatch } = useContext(Context);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const currDeviceType = GetDeviceType();

    const handleLogout = () => {
        dispatch(LoginFailure());
    };

    var burgerMenuStyles = {
        bmBurgerButton: {
            position: 'fixed',
            width: '36px',
            height: '30px',
            left: '10px',
            top: '10px'
        },
        bmBurgerBars: {
            background: '#373a47'
        },
        bmBurgerBarsHover: {
            background: '#a90000'
        },
        bmCrossButton: {
            height: '24px',
            width: '24px',
            margin: '1rem'
        },
        bmCross: {
            background: '#bdc3c7'
        },
        bmMenuWrap: {
            position: 'fixed',
            height: '100%'
        },
        bmMenu: {
            background: '#373a47',
            padding: '2.5em 1.5em 0',
            fontSize: '1.15em'
        },
        bmMorphShape: {
            fill: '#373a47'
        },
        bmItemList: {
            color: '#b8b7ad',
            padding: '0.8em',
        },
        bmItem: {
            /*display: 'inline-block'*/
        },
        bmOverlay: {
            background: 'rgba(0, 0, 0, 0.3)'
        }
    }

    return (
        <>
            {(currDeviceType === DeviceType.PHONE ||
                currDeviceType === DeviceType.TABLET) &&
                    <Menu Menu styles={burgerMenuStyles}>
                        <ul className="topBurgerMenuIList">
                            <li className="topBurgerMenuItem">
                                <Link to="/" className="link">HOME</Link>
                            </li>
                            {user &&
                                <li className="topBurgerMenuItem">
                                    <Link to={`/?username=${user.username}`} className="link">MY POSTS</Link>
                                </li>
                            }
                            <li className="topBurgerMenuItem">
                                <Link to="/writepage" className="link">WRITE</Link>
                            </li>
                            <li className="topBurgerMenuItem">
                                <Link to="/about" className="link">ABOUT</Link>
                        </li>
                        <>
                            {user ?
                                <li className="topBurgerMenuItem">
                                    <Link to="/" onClick={handleLogout} className="link">LOGOUT</Link>
                                </li>
                                :
                                <>
                                    <li className="topBurgerMenuItem">
                                        <Link to="/login" className="link">LOGIN</Link>
                                    </li>
                                    <li className="topBurgerMenuItem">
                                        <Link to="/register" className="link">REGISTER</Link>
                                    </li>
                                </>
                            }
                            </>
                            <div className="topSideSwitch">
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
                        </ul>
                    </Menu>
            }
            <div className='topbar'>
                <div className="topLeft">
                    {currDeviceType === DeviceType.DESKTOP &&
                        <>
                            <div className="topTitle">
                                <img className="topTitleImage" src={BC} alt=""/>
                                <h2>
                                    <Link to="/" className="link">
                                        Book Club
                                    </Link>
                                </h2>
                            </div>
                            <SocialMediaIcons user={user} barPosition="top" />
                        </>
                    }
                </div>
                <div className="topCenter">
                    <ul className="topList">
                        {currDeviceType === DeviceType.DESKTOP ? 
                            <>
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
                            </>
                            :
                            <>
                                <img className="topTitleImage" src={BC} alt=""/>
                                <h2>Book Club</h2>
                            </>
                        }
                    </ul>
                </div>
                    <div className="topRight">
                    {
                        user ? (
                            <>
                                {currDeviceType === DeviceType.DESKTOP &&
                                    <ReputationIcon repScore={user.reputation} user={user} />
                                }
                                <Link to="/settings" className="link">
                                    <img
                                        className="topImg"
                                        src={user.profilePicture}
                                        alt=""
                                    />
                                </Link>
                            </>
                        ) : (
                            <>
                                {currDeviceType === DeviceType.DESKTOP &&
                                    <ul className="topList">
                                        <li className="topListItem">
                                            <Link to="/login" className="link">LOGIN</Link>
                                        </li>
                                        <li className="topListItem">
                                            <Link to="/register" className="link">REGISTER</Link>
                                        </li>
                                    </ul>
                                }
                            </>
                        )
                        }
                    <i className="topSearchIcon fa-solid fa-magnifying-glass"></i>
                    {currDeviceType === DeviceType.DESKTOP &&
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
                    }
                </div>
            </div>
        </>
  )
}
