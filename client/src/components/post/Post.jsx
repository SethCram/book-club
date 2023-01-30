import { Link } from "react-router-dom"
import "./Post.css"

export const imagesFolder = "http://localhost:5000/images/";

export default function post({post}) {
  
  return (
      <div className="post">
        {post.photo && ( //shows post's image if provided
          <img
            className="postImg"
            src={imagesFolder + post.photo} 
            alt="" 
          />
          ) }  
        
        <div className="postInfo">
          <div className="postCategories">
            {
              post.categories.map((category, i) => (
                <span className="postCategory" key={i}>
                  <Link to={`/${category.name}`} className="link">{category.name}</Link>
                </span>
              ))
            }
            
          </div>
          <span className="postTitle">
            <Link to={`singlePostPage/${post._id}`} className="link">{post.title}</Link> {/* obj id comes with _ before it */ }
          </span>
          <hr />
          <span className="postDate">Published: <b>{new Date(post.createdAt).toDateString()}</b></span>
        </div>
        <p className="postDescription">
          {post.description}
        </p>
      </div>
  )
}