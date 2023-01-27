import { Link } from "react-router-dom"
import "./Post.css"

export default function post({post}) {
  return (
      <div className="post">
        {post.photo && ( //shows post's image if provided
          <img
            className="postImg"
            src={post.photo} alt="" 
          />
          ) }  
        
        <div className="postInfo">
          <div className="postCategories">
            {
              post.categories.map(category => (
                <span className="postCategory">
                  <Link to={`/${category.name}`} className="link">{category.name}</Link>
                </span>
              ))
            }
            
          </div>
          <span className="postTitle">
            <Link to={`singlePostPage/${post._id}`} className="link">{post.title}</Link> {/* obj id comes with _ before it */ }
          </span>
          <hr />
          <span className="postDate">{new Date(post.createdAt).toDateString()}</span>
        </div>
        <p className="postDescription">
          {post.description}
        </p>
      </div>
  )
}
