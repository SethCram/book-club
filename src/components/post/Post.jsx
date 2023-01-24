import "./Post.css"

export default function post() {
  return (
      <div className="post">
          <img
              className="postImg"
              src="https://upload.wikimedia.org/wikipedia/commons/c/c6/SearsHouse115.jpg" alt="" 
            />
        <div className="postInfo">
              <div className="postCategories">
                  <span className="postCategory">Music</span>
                  <span className="postCategory">Life</span>
              </div>
              <span className="postTitle">
                5 Tips for Staying Productive While Working from Home
              </span>
              <hr />
              <span className="postDate">1 hour ago</span>
          </div>
          <p className="postDescription">
            Establish a routine and stick to it - set regular work hours and take regular breaks to maintain a sense of structure and balance in your day.
            Create a dedicated workspace - set up a designated area in your home that is solely for work to help separate work from leisure.
            Take regular breaks - stepping away from your work for short breaks can help you stay focused and refreshed throughout the day.
            Prioritize and plan your tasks - make a to-do list and prioritize your tasks to help you stay on track and focused on what needs to be done.
            Stay connected - working from home can be isolating, so make sure to stay connected with your colleagues and friends through virtual communication channels such as video conferencing, instant messaging and email.
          </p>
      </div>
  )
}
