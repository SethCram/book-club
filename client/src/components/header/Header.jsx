import "./Header.css"

export default function Header() {
  return (
      <div className='header'>
        <div className="headerTitles">
            <span className="headerTitleSmall">React & Node</span>
            <span className="headerTitleLarge">Blog</span>
          </div>
          <img
            className="headerImg"
            src="https://upload.wikimedia.org/wikipedia/commons/8/8f/Bachalpsee_reflection.jpg"
            alt=""
          />
      </div>
  )
}
