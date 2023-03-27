import "./Settings.css"
import SideBar from "../../components/sidebar/Sidebar"
import { useContext, useState, useEffect } from "react"
import { Context } from "../../context/Context"
import axios from "axios";
import { UserUpdateFailure, UserUpdateStart, UserUpdateSuccessful } from "../../context/Actions";

export default function Settings() {
    const [picture, setPicture] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [bio, setBio] = useState("");
    const [instagramLink, setInstagramLink] = useState("");
    const [twitterLink, setTwitterLink] = useState("");
    const [facebookLink, setFacebookLink] = useState("");
    const [pinterestLink, setPinterestLink] = useState("");

    const { user, dispatch } = useContext(Context); 

    //retrieve user according to userId
    useEffect(() => {
        const getUser = async () => { //could do so thru through using user props instead of api call
            const response = await axios.get("/users/id/" + user._id);
                
            setUsername(response.data.username);
            setEmail(response.data.email);  
            setBio(response.data.bio);
            setInstagramLink(response.data.instagramLink);
            setTwitterLink(response.data.twitterLink);
            setFacebookLink(response.data.facebookLink);
            setPinterestLink(response.data.pinterestLink);
        };
        getUser();      

    }, [user._id]) //rerun when postId changes
    
    const handleUpdate = async (event) => {
        event.preventDefault();

        setError("");

        dispatch(UserUpdateStart());

        setSuccess(false);
        
        const updatedUser = {
            userId: user._id,
            username,
            email,
            bio,
            password,
            instagramLink,
            twitterLink,
            facebookLink,
            pinterestLink
        };

        if (picture)
        {
            const data = new FormData();
            const fileName = Date.now() + picture.name;
            
            data.append("name", fileName);
            data.append("file", picture);

            try {
                const response = await axios.post("/upload", data);
                updatedUser.profilePicture = response.data.url;
            } catch (error) {
                console.log(error);
            }
        }

        try {

            const response = await axios.put(`/users/${user._id}`, updatedUser);

            //window.location.reload(); //reload page

            setPassword("");

            setSuccess(true);
            dispatch(UserUpdateSuccessful(response.data));
        } catch (error) {
            setError(error.response.data);
            dispatch(UserUpdateFailure());
        }
        
    };

    const handleDeleteAccount = async () => {

        dispatch(UserUpdateStart());

        try {
            await axios.delete("/users/" + user._id, {
                data: { userId: user._id, username: user.username }
            });

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
                          src={picture ? URL.createObjectURL(picture) : user.profilePicture}
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
                      required
                  />
                  <label>Email</label>
                  <input
                      type="text"
                      placeholder="Enter a new email..."
                      value={email}
                      onChange={(event) => { setEmail(event.target.value) }} 
                      required
                  />
                  <label>Bio</label>
                  <input
                      type="text"
                      placeholder="Enter a new bio..."
                      value={bio}
                      onChange={(event) => { setBio(event.target.value) }} 
                  />
                  <label>Instagram</label>
                  <input
                      type="text"
                      placeholder="Enter a new instagram link..."
                      value={instagramLink}
                      onChange={(event) => { setInstagramLink(event.target.value) }} 
                  />
                  <label>Twitter</label>
                  <input
                      type="text"
                      placeholder="Enter a new twitter link..."
                      value={twitterLink}
                      onChange={(event) => { setTwitterLink(event.target.value) }} 
                  />
                  <label>Facebook</label>
                  <input
                      type="text"
                      placeholder="Enter a new facebook link..."
                      value={facebookLink}
                      onChange={(event) => { setFacebookLink(event.target.value) }} 
                  />
                  <label>Pinterest</label>
                  <input
                      type="text"
                      placeholder="Enter a new pinterest link..."
                      value={pinterestLink}
                      onChange={(event) => { setPinterestLink(event.target.value) }} 
                  />
                  <label>Password</label>
                  <input
                      type="password"
                      placeholder="Verify your password..."
                      onChange={(event) => { setPassword(event.target.value) }}
                      value={password}
                      required
                  />
                  <button className="settingsSubmit" type="submit">Update</button>
                  <div className="settingsMessages">
                    {success && <span className="settingsSubmitMessage">Your profile has been updated</span>}
                    {error && <span className="settingsFailureMessage">{error}</span>}
                  </div>
              </form>
          </div>
          <SideBar user={user} />
    </div>
  )
}
