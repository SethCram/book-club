import "./SocialMediaIcons.css"

export default function SocialMediaIcons({user, barPosition}) {
    const topbar = barPosition === "top";
    return (      
    <div>
        {user?.instagramLink &&
            <a className='link' href={user.instagramLink}>
                <i
                    className={"fa-brands fa-square-instagram " + (topbar ? "topIcon" : "sidebarIcon")}
                    target="_blank"
                />
            </a>
        }
        {user?.twitterLink &&
            <a className='link' href={user.twitterLink}>
                <i
                    className={"fa-brands fa-square-twitter " + (topbar ? "topIcon" : "sidebarIcon")} 
                    target="_blank"
                />
            </a>
        }
        {user?.facebookLink &&
            <a className='link' href={user.facebookLink}>
                <i
                    className={"fa-brands fa-square-facebook " + (topbar ? "topIcon" : "sidebarIcon")}
                    target="_blank"
                />
            </a>
        }
        {user?.pinterestLink &&
            <a className='link' href={user.pinterestLink}>
                <i
                    className={"fa-brands fa-square-pinterest " + (topbar ? "topIcon" : "sidebarIcon")}
                    target="_blank"
                />
            </a>
        }
    </div>
  )
}
