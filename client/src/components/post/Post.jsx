import { Link } from "react-router-dom"
import ReputationIcon from "../reputationIcon/ReputationIcon"
import "./Post.css"
import * as DOMPurify from 'dompurify'; /* permit HTML, SVG and MathML (may only need HTML?) */

export default function post({ post }) {

  // Specify a configuration directive, only <p> and <span> elements allowed
  // Note: We want to also keep the allow element's text content, so we add #text too
  // KEEP_CONTENT removes content from non-allow-listed nodes
  const sanitizeConfig = {
    ALLOWED_TAGS: [
      'p', 'span', '#text', 'mark', 'i', 'strong', 'u', 'ul',
      'li', 'ol', 's', 'sub', 'sup', 'blockquote', 'code'
    ], KEEP_CONTENT: false
  };
  const dirtyHTML = post.description;
  const cleanHTML = DOMPurify.sanitize(dirtyHTML, sanitizeConfig);
  /* rm all whitespace lines */
  const compactCleanHTML = cleanHTML.replaceAll(/<p>(&nbsp;)+<\/p>/g, ""); 

  return (
      <div className="post container">
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
            <ReputationIcon repScore={post.reputation} post={post}/>
            <div className="postTitle">
              <Link to={`singlepostpage/${post._id}`} className="link">{post.title}</Link> 
            </div>
          </span>
          <span className="postAuthorDate">
            <Link className="link" to={`/?username=${post?.username}`}>
              <b className="postAuthor">
                {post.username }
              </b>
            </Link>
            <b className="postDate">
              {new Date(post.createdAt).toDateString()}
            </b>
          </span>
      </div>
        <p
          dangerouslySetInnerHTML={{ __html: compactCleanHTML }} 
          className="postDescription ck-content"
        />
      </div>
  )
}