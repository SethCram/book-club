import axios from "axios";
import { useContext, useRef } from "react";
import { Link } from "react-router-dom"
import { Context } from "../../context/Context";
import "./Login.css"

export default function Login() {

  const emailReference = useRef(); //could login using username too (email unique so can use)
  const passwordReference = useRef();
  const { user, dispatch, isFetching } = useContext(Context);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    //start login according to context
    dispatch({
      type: "LOGIN_START"
    });

    try {
      //validate login
      const response = await axios.post("/auth/login", {
        email: emailReference.current.value,
        password: passwordReference.current.value
      });

      //tell user context of login success
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data
      });

    } catch (error) {
      //tell user context of login failure
      dispatch({
        type: "LOGIN_FAILURE"
      });
    }
  }

  console.log(user);

  return (
      <div className="login">
          <span className="loginTitle">Login</span>
          <form className="loginForm" onSubmit={handleSubmit}>
              <label>Email</label>
          <input
            className="loginInput"
            type="text"
            placeholder="Enter your email..." 
            ref={emailReference}
            />
                <label>Password</label>
          <input
            className="loginInput"
            type="password"
            placeholder="Enter your password..." 
            ref={passwordReference}
            />
          <button
            className="loginLoginButton"
            type="submit"
          >
            Login
          </button>
          </form>
          <button className="loginRegisterButton">
            <Link to="/register" className="link">Register</Link>
          </button>
      </div>
      
  )
}
