import TopBar from "./components/topbar/TopBar";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Settings from "./pages/settings/Settings";
import SinglePostPage from "./pages/singlepostpage/SinglePostPage";
import WritePage from "./pages/writepage/WritePage";
import Register from "./pages/register/Register";
import { Context } from "./context/Context";
import About from "./pages/about/About";
import "./App.css"
import { useLayoutEffect } from 'react'
import NotFound from "./pages/notfound/NotFound";
import jwt_decode from "jwt-decode";
import { UserUpdateFailure, UserUpdateStart, UserUpdateSuccessful } from "./context/Actions";


// Need the following to setup dynamic routing:
import { createContext, useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import axios from "axios";

export const ThemeContext = createContext(null);

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

export const DeviceType = {
  DESKTOP: 1,
  TABLET: 2,
  PHONE: 3
}

export const GetDeviceType = () => {
  const [width, _] = useWindowSize();

  let currDeviceType;

  // Viewport is less or equal to 600 pixels wide
  if (width <= 600) {
      currDeviceType = DeviceType.PHONE;
  }
  // Viewport is less or equal to 1024 pixels wide
  else if (width <= 1024) {
      currDeviceType = DeviceType.TABLET;
  }
  // Viewport is greater than 1024 pixels wide
  else {
      currDeviceType = DeviceType.DESKTOP;
  }

  return currDeviceType;
}

const refreshTokens = async (user, dispatch) => {

  try {
    dispatch(UserUpdateStart());

    const response = await axios.post("/auth/refresh", {
      token: user.refreshToken
    });

    const tokens = response.data;

    const updatedUser = { ...user, ...tokens }

    if (tokens.accessToken !== updatedUser.accessToken) {
      throw new Error("Updated user not constructed with the new access token.");
    }

    dispatch(UserUpdateSuccessful(updatedUser));

    //console.log(`Pre-returned new tokens are ${tokens.accessToken} and ${tokens.refreshToken}`);

    return tokens;

  } catch (error) {
    dispatch(UserUpdateFailure());
    return Promise.reject(error);
  }
}

export const getAxiosAuthHeaders = async (user, dispatch) => {

  if (!user) {
    return Promise.reject("No user available.");
  }

  if (!user.accessToken || !user.refreshToken) {
    return Promise.reject("User doesn't have the proper tokens.");
  }

  let axiosAuthHeaders = {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    }
  }

  let currentDate = new Date();

  let tokens;

  //decode access token
  const decodedToken = jwt_decode(user.accessToken);

  //if token is expired
  if(decodedToken.exp * 1000 < currentDate.getTime())
  {
    //console.log(`Old token ${user.accessToken}`);

    const newTokens = await refreshTokens(user, dispatch);

    tokens = newTokens;
    
    //console.log(`New token ${tokens.accessToken}`);
  }
  else {
    tokens = {
      refreshToken: user.refreshToken,
      accessToken: user.accessToken
    }
  }

  //set access token as auth header
  axiosAuthHeaders.headers['Authorization'] = 'Bearer ' + tokens.accessToken;

  return [axiosAuthHeaders, tokens];
}

function App() {
  const { user } = useContext(Context);
  const [theme, setTheme] = useState(localStorage.getItem("mode") ? localStorage.getItem("mode"): "dark");

  const toggleTheme = () => {

    let newTheme;

    //if theme is light
    if (theme === "light") {
      //set it dark
      newTheme = "dark";
    //if theme is dark
    } else {
      //set it light
      newTheme = "light"
    }

    localStorage.setItem("mode", newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div id={theme}>
        <Router>
          <TopBar />
          {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/about' element={<About />} />
            <Route exact path="/login" element={user ? <Home/> : <Login/>}/>
            <Route exact path="/register" element={user ? <Home/> : <Register/>}/>
            <Route exact path="/settings" element={user ? <Settings/> : <Register/>}/>
            <Route exact path="/writepage" element={user ? <WritePage/> : <Register/>}/>
            <Route exact path="/singlepostpage/:postId" element={<SinglePostPage/>}/>
            <Route path="*" element={<NotFound/>}/>
          </Routes>
        </Router>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
