import './Sidebar.css'

export default function Sidebar() {
  return (
    <div className='sidebar'>
          <div className='sidebarItem'>
              <span className='sidebarTitle'>ABOUT ME</span>
              <img
                  src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                  alt="" 
                  />
              <p>
                  "Exploring the world one adventure at a time.
                  Lover of good food, great company, and endless possibilities.
                  Join me on my journey and let's make memories together. #travel #foodie #adventureseeker"
              </p>
          </div>
          <div className='sidebarItem'>
              <span className='sidebarTitle'>CATEGORIES</span>
              <ul className='sidebarList'>
                  <li className='sidebarListItem'>Life</li>
                  <li className='sidebarListItem'>Music</li>
                  <li className='sidebarListItem'>Style</li>
                  <li className='sidebarListItem'>Sports</li>
                  <li className='sidebarListItem'>Movies</li>
                  <li className='sidebarListItem'>Tech</li>
              </ul>
          </div>
          <div className='sidebarItem'>
              <span className='sidebarTitle'>FOLLOW US</span>
              <div className='sidebarSocial'>
                <i className="sidebarIcon fa-brands fa-square-instagram"></i>
                <i className="sidebarIcon fa-brands fa-square-twitter"></i>
                <i className="sidebarIcon fa-brands fa-square-facebook"></i>
                <i className="sidebarIcon fa-brands fa-square-pinterest"></i>
              </div>
          </div>
    </div>
  )
}
