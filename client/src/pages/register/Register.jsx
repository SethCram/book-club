import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom"
import "./Register.css"

export default function Register() { //could use context API to register but not storing anything after registration (stored during login)
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  
  const handleSubmit = async (event) => { //need to def funct as async if ever await
    event.preventDefault(); //dont refresh if page submitted w/ no info

    setError(false);

    try { //should return "username in use" if duplicate username (from api error code)
      const response = await axios.post("/auth/register", { //submit registration w/ all needed info
        username,
        email,
        password
      });
      (response.data && window.location.replace("login")); //redir to login page
    } 
    catch (error) {
      setError(true);
    }
    
  };

  return (
      <div className="register">
          <span className="registerTitle">Register</span>
          <form className="registerForm" onSubmit={handleSubmit}>
              <label>Username</label>
              <input
                className="registerInput"
                type="text"
                placeholder="Enter your username..." 
                onChange={event=>setUsername(event.target.value)} 
                required
              />
              <label>Email</label>
              <input
                className="registerInput"
                type="text"
                placeholder="Enter your email..." 
                onChange={event=>setEmail(event.target.value)}
                required
              />
              <label>Password</label>
              <input
                className="registerInput"
                type="password"
                placeholder="Enter your password..." 
                onChange={event=>setPassword(event.target.value)}
                required
              />
              <button className="registerRegisterButton" type="submit">Register</button>
          </form>
          <button className="registerLoginButton">
            <Link to="/login" className="link">Login</Link>  
      </button>
      {error && <span style={{color:"red", marginTop: "10px", fontWeight: "700"}}>Something went wrong</span>}
      </div>
  )
}
