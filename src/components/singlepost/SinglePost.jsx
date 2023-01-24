import "./SinglePost.css"

export default function SinglePost() {
  return (
      <div className="singlePost">
          <div className="singlePostWrapper">
              <img
                  className="singlePostImg"
                  src="https://upload.wikimedia.org/wikipedia/commons/3/30/Walking_for_Health_in_Epsom-5Aug2009_%283%29.jpg"
                  alt="" 
              />
              <h1 className="singlePageTitle">
                  The Importance of Self-Care for Mental Health
                  <div className="singlePostIcons">
                      <i className="singlePostIcon fa-regular fa-pen-to-square"></i>
                      <i className="singlePostIcon fa-regular fa-trash-can"></i>
                  </div>
              </h1>
              <div className="singlePostInfo">
                  <span className="singlePostAuthor">Author: <b>Seth</b></span>
                  <span className="singlePostDate">1 hour ago</span>
              </div>
              <p className="singlePostDescription">
                Self-care is a crucial aspect of maintaining good mental health. It involves taking the time to focus on one's own physical, emotional, and psychological well-being. It includes activities such as exercise, healthy eating, getting enough sleep, and managing stress. Regular self-care practices can help prevent burnout, reduce the risk of developing mental health disorders, and improve overall mood and well-being.
                Self-care can also be beneficial for individuals who are already experiencing mental health issues. For example, engaging in regular exercise can help reduce symptoms of depression and anxiety. Eating a healthy diet can help improve overall mood and energy levels. Getting enough sleep can help improve cognitive functioning and reduce the risk of developing mental health disorders.
                Self-care is a personal and individual practice that should be tailored to meet the needs of the individual. It's not one-size-fits-all, It's important to find self-care activities that are enjoyable and that can be incorporated into daily routine. It may take some experimentation to find what works best for you.
                In summary, self-care is essential for maintaining good mental health. It can help prevent burnout, reduce symptoms of mental health disorders, and improve overall mood and well-being. Regular self-care practices should be a priority for everyone to maintain optimal mental health.
              </p>
          </div>
      </div>
  )
}
