import { Link } from "react-router-dom"
import ReputationIcon from "../reputationIcon/ReputationIcon"
import "./Post.css"

export default function post({ post }) {

  return (
      <div className="post">
        {post.photo && ( //shows post's image if provided
          <img
            className="postImg"
            src={post.photo} 
            alt="" 
          />
          ) }  
        
        <div className="postInfo">
          <div className="postCategories">
            {
              post.categories.map((category, i) => (
                <span className="postCategory" key={i}>
                  <Link to={`/?category=${category.name}`} className="link">{category.name}</Link>
                </span>
              ))
            }
          </div>
          <span className="postTitleRow">
            <ReputationIcon repScore={post.reputation} isPost={true}/>
            <div className="postTitle">
              <Link to={`singlepostpage/${post._id}`} className="link">{post.title}</Link> {/* obj id comes with _ before it */ }
            </div>
          </span>
          <div className="postAuthorDate">
            <Link className="link" to={`/?username=${post?.username}`}>
              <b className="postAuthor">
                {post.username }
              </b>
            </Link>
            <b className="postDate">
              {new Date(post.createdAt).toDateString()}
            </b>
          </div>
      </div>
        <p className="postDescription">
          {post.description}
        </p>
      </div>
  )
}