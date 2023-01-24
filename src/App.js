import TopBar from "./components/topbar/TopBar";
import Home from "./pages/home/Home";
import Settings from "./pages/settings/Settings";
import SinglePostPage from "./pages/singlepostpage/SinglePostPage";
import WritePage from "./pages/writepage/WritePage";

function App() {
  return (
    <div>
      <TopBar></TopBar>
      <Settings />
    </div>
  );
}

export default App;
