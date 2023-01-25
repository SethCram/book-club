import { Link } from "react-router-dom";
import "./TopBar.css"

export default function TopBar() {
    const user = true;
    return (
      <div className='topbar'>
          <div className="topLeft">
              <i className="topIcon fa-brands fa-square-instagram"></i>
              <i className="topIcon fa-brands fa-square-twitter"></i>
              <i className="topIcon fa-brands fa-square-facebook"></i>
              <i className="topIcon fa-brands fa-square-pinterest"></i>
          </div>
          <div className="topCenter">
              <ul className="topList">
                    <li className="topListItem">
                        <Link to="/" className="link">HOME</Link>
                    </li>
                    <li className="topListItem">
                        <Link to="/settings" className="link">ABOUT</Link>
                    </li>
                    <li className="topListItem">
                        <Link to="/contact" className="link">CONTACT</Link>
                    </li>
                    <li className="topListItem">
                        <Link to="/writepage" className="link">WRITE</Link>
                    </li>
                    <li className="topListItem">
                        {user && <Link to="/" className="link">LOGOUT</Link> }
                    </li>
              </ul>
          </div>
            <div className="topRight">
                {
                    user ? (
                        /* need a link here to settings */
                        <img
                            className="topImg"
                            src="https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png"
                            alt=""
                        />
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
