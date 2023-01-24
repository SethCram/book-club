import TopBar from "./components/topbar/TopBar";
import Home from "./pages/home/Home";
import SinglePostPage from "./pages/singlepostpage/SinglePostPage";
import WritePage from "./pages/writepage/WritePage";

function App() {
  return (
    <div>
      <TopBar></TopBar>
      <WritePage/>
    </div>
  );
}

export default App;
