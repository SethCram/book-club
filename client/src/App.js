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

// Need the following to setup dynamic routing:
import { createContext, useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

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
  const [width, height] = useWindowSize();

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

function App() {
  const { user } = useContext(Context);
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme((currTheme) => ( currTheme === "light" ? "dark" : "light" ));
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
