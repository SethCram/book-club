import "./Header.css"

export default function Header({ queryTerms }) {
  return (
      <div className='header'>
        {queryTerms ? 
          <>
            <span className="headerSearchTitle"> Search Results </span>
            <hr className="headerSearchBar"/>
          </>
          : 
          <>
            <div className="headerTitles">
              <span className="headerTitleSmall">Blog</span>
              <span className="headerTitleLarge">Writing Platform</span>
            </div>
            <img
              className="headerImg"
              src="https://upload.wikimedia.org/wikipedia/commons/8/8f/Bachalpsee_reflection.jpg"
              alt=""
            />
          </>
        }
      </div>
  )
}
