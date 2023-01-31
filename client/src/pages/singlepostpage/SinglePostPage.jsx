import Sidebar from "../../components/sidebar/Sidebar"
import SinglePost from "../../components/singlepost/SinglePost"
import "./SinglePostPage.css"

export default function SinglePostPage() {

  return (
      <div className='singlepostpage'>
          <SinglePost/>
          <Sidebar />
    </div>
  )
}
