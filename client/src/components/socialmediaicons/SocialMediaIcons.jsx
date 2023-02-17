import "./SocialMediaIcons.css"

const generateIcon = (link, classNames, topbar) => (
    <i className={(topbar ? "topIcon" : "sidebarIcon")}>
        <a
            className={`${classNames} link`}
            href={link}
            target="_blank"
            rel="noreferrer"
        />
    </i>
);

export default function SocialMediaIcons({user, barPosition}) {
    const topbar = barPosition === "top";
    return (      
    <div>
        {generateIcon(user?.instagramLink, "fa-brands fa-square-instagram", topbar)}
        {generateIcon(user?.twitterLink, "fa-brands fa-square-twitter", topbar)}
        {generateIcon(user?.facebookLink, "fa-brands fa-square-facebook", topbar)}
        {generateIcon(user?.pinterestLink, "fa-brands fa-square-pinterest", topbar)}
    </div>
  )
}
