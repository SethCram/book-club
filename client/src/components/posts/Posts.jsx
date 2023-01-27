import Post from "../post/Post"
import "./Posts.css"

export default function Posts({posts}) {
  return (
    <div className="posts">
      {
        posts.map(eachPost => (
          <Post post={eachPost} />
        ))
      }
    </div>
  )
}
