import logo from '../../assets/favicon_io/android-chrome-192x192.png';
import "./NotFound.css"

export default function NotFound() {
  return (
    <div className="notFound">
        <div className='notFoundWrapper'>
            <img src={logo} className="notFoundLogo" alt="" />
            <p className='notFoundDetails'>
                Error 404: Page Not Found
            </p>
            <a 
                className="notFoundLink"
                href="https://github.com/SethCram/book-club/issues/new/choose"
                target="_blank"
                rel="noopener noreferrer"
            >
                Help Us Out
            </a>
        </div>
    </div>
  )
}
