import TopBar from "./components/topbar/TopBar";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Settings from "./pages/settings/Settings";
import SinglePostPage from "./pages/singlepostpage/SinglePostPage";
import WritePage from "./pages/writepage/WritePage";
import Register from "./pages/register/Register";

// Need the following to setup dynamic routing:
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <TopBar />
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/register" element={<Register/>}/>
        <Route exact path="/settings" element={<Settings/>}/>
        <Route exact path="/writepage" element={<WritePage/>}/>
        <Route exact path="/singlepostpage/:postId" element={<SinglePostPage/>}/>
        {/*<Route path="*" element={<NotFound/>}/>*/}
      </Routes>
    </Router>
  );
}

export default App;
