import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import "./Register.css"
import PasswordChecklist from "react-password-checklist"

export default function Register() { //could use context API to register but not storing anything after registration (stored during login)
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (event) => { //need to def funct as async if ever await
    event.preventDefault(); //dont refresh if page submitted w/ no info

    setError("");

    try { //should return "username in use" if duplicate username (from api error code)
      const response = await axios.post("/api/auth/register", { //submit registration w/ all needed info
        username,
        email,
        password
      });
      (response.data && navigate("/login")); //redir to login page
    } 
    catch (error) {
      setError(error.response.data);
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
              <label>Confirm Password</label>
              <input
                className="registerInput"
                type="password"
                placeholder="Re-enter your password..." 
                onChange={event=>setConfirmPassword(event.target.value)}
                required
              />
              <div className="registerPasswordValidation">
                <PasswordChecklist
                  rules={["minLength","specialChar","number","capital","match"]}
                  minLength={8}
                  value={password}
                  valueAgain={confirmPassword}
                  onChange={(isValid) => {setPasswordValid(isValid)}}
                />
              </div>
              {error && <span className="responseMsg errorText registerError">{error}</span>}
              <button 
                className="registerRegisterButton" 
                type="submit"
                disabled={!passwordValid}
              >
                Register
              </button>
          </form>
          <button className="registerLoginButton">
            <Link to="/login" className="link">Login</Link>  
          </button>
      </div>
  )
}
