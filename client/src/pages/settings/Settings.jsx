import "./Settings.css"
import SideBar from "../../components/sidebar/Sidebar"

export default function Settings() {
  return (
      <div className="settings">
          <div className="settingsWrapper">
              <div className="settingsTitle">
                  <span className="settingsUpdateTitle">Update Account</span>
                  <span className="settingsDeleteTitle">Delete Account</span>
              </div>
              <form className="settingsForm">
                  <label>Profile Picture</label>
                  <div className="settingsProfilePicture">
                      <img
                          src="https://upload.wikimedia.org/wikipedia/commons/d/d8/Person_icon_BLACK-01.svg"
                          alt="" 
                      />
                      <label htmlFor="fileInput">
                        <i className="settingsProfilePictureIcon fa-regular fa-circle-user"></i>
                      </label>
                      <input type="file" id="fileInput" style={{display:"none"}} />
                  </div>
                  <label>Username</label>
                  <input type="text" placeholder="Enter your username..." />
                  <label>Email</label>
                  <input type="text" placeholder="Enter your email..." />
                  <label>Password</label>
                  <input type="password" placeholder="Enter your password..." />
                  <button className="settingsSubmit">Update</button>
              </form>
          </div>
          <SideBar/>
    </div>
  )
}
