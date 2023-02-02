import { Link } from "react-router-dom"
import "./SocialMediaIcons.css"

export default function SocialMediaIcons({user, barPosition}) {
    const topbar = barPosition === "top";
    return (      
    <div>
        {user.instagramLink &&
            <Link className='link' to={user.instagramLink}>
                <i className={"fa-brands fa-square-instagram " + (topbar ? "topIcon" : "sidebarIcon")}></i>
            </Link>
        }
        {user.twitterLink &&
            <Link className='link' to={user.twitterLink}>
                    <i className={"fa-brands fa-square-twitter " + (topbar ? "topIcon" : "sidebarIcon")}></i>
            </Link>
        }
        {user.facebookLink &&
            <Link className='link' to={user.facebookLink}>
                    <i className={"fa-brands fa-square-facebook " + (topbar ? "topIcon" : "sidebarIcon")}></i>
            </Link>
        }
        {user.pinterestLink &&
            <Link className='link' to={user.pinterestLink}>
                    <i className={"fa-brands fa-square-pinterest " + (topbar ? "topIcon" : "sidebarIcon")}></i>
            </Link>
        }
    </div>
  )
}
