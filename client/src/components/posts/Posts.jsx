import Post from "../post/Post"
import "./Posts.css"

export default function Posts({posts}) {
  return (
    <div className="posts">
      {
        posts.map((eachPost, i) => (
          <Post post={eachPost} key={i} />
        ))
      }
    </div>
  )
}
