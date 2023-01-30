import "./Settings.css"
import SideBar from "../../components/sidebar/Sidebar"
import { useContext, useState, useEffect } from "react"
import { Context } from "../../context/Context"
import axios from "axios";
import { imagesFolder } from "../../components/post/Post";
import { UserUpdateFailure, UserUpdateStart, UserUpdateSuccessful } from "../../context/Actions";

export default function Settings() {
    const [picture, setPicture] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const [bio, setBio] = useState("");

    const { user, dispatch } = useContext(Context);

    //retrieve user according to userId
    useEffect(() => {
        const getUser = async () => { //could do so thru through using user props instead of api call
            const response = await axios.get("/users/" + user._id);
                
            setUsername(response.data.username);
            setEmail(response.data.email);        
        };
        getUser();      

    }, [user._id]) //rerun when postId changes
    
    const handleUpdate = async (event) => {
        event.preventDefault();

        dispatch(UserUpdateStart());

        setSuccess(false);
        
        const updatedUser = {
            userId: user._id,
            username,
            email,
            bio,
            password
        };

        if (picture)
        {
            const data = new FormData();
            const fileName = Date.now() + picture.name;
            
            data.append("name", fileName);
            data.append("file", picture);

            updatedUser.profilePicture = fileName;

            try {
                await axios.post("/upload", data);
            } catch (error) {
                
            }
        }

        try {

            const response = await axios.put(`/users/${user._id}`, updatedUser);

            //window.location.reload(); //reload page

            setSuccess(true);
            dispatch(UserUpdateSuccessful(response.data));
        } catch (error) {
            dispatch(UserUpdateFailure());
        }
        
    };

    const handleDeleteAccount = async () => {

        dispatch(UserUpdateStart());

        try {
            await axios.delete("/users/" + user._id, {
                data: { userId: user._id }
            });

            //auto-navigates back to register page after deletion for some reason
            //window.location.replace("/"); 

            dispatch(UserUpdateSuccessful(null));
        } catch (error) {
            dispatch(UserUpdateFailure());
        }
        
    };

  return (
      <div className="settings">
          <div className="settingsWrapper">
              <div className="settingsTitle">
                  <span className="settingsUpdateTitle">Update Account</span>
                  <span className="settingsDeleteTitle" onClick={handleDeleteAccount}>
                    Delete Account
                  </span>
              </div>
              <form className="settingsForm" onSubmit={handleUpdate}>
                  <label>Profile Picture</label>
                  <div className="settingsProfilePicture">
                      <img
                          src={picture ? URL.createObjectURL(picture) : imagesFolder + user.profilePicture}
                          alt="" 
                      />
                      <label htmlFor="fileInput">
                        <i className="settingsProfilePictureIcon fa-regular fa-circle-user"></i>
                      </label>
                      <input
                          type="file"
                          id="fileInput"
                          style={{ display: "none" }} 
                          onChange={event=>{setPicture(event.target.files[0])}}
                      />
                  </div>
                  <label>Username</label>
                  <input
                      type="text"
                      placeholder="Enter a new username..."
                      value={username}
                      onChange={(event) => { setUsername(event.target.value) }}
                  />
                  <label>Email</label>
                  <input
                      type="text"
                      placeholder="Enter a new email..."
                      value={email}
                      onChange={(event) => { setEmail(event.target.value) }} 
                  />
                  <label>Bio</label>
                  <input
                      type="text"
                      placeholder="Enter a new bio..."
                      value={bio}
                      onChange={(event) => { setBio(event.target.value) }} 
                  />
                  <label>Password</label>
                  <input
                      type="password"
                      placeholder="Enter a new password..."
                      onChange={(event) => { setPassword(event.target.value) }}
                  />
                  <button className="settingsSubmit" type="submit">Update</button>
                  {success && <span className="settingsSubmitMessage">Your profile has been updated</span>}
              </form>
          </div>
          <SideBar/>
    </div>
  )
}
