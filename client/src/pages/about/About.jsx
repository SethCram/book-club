import "./About.css"
import { DeviceType, GetDeviceType } from "../../App";

function renderSlides(src, currDeviceType, title) {
    return(
        <div className="aboutSlides">
            <iframe
                src={src}
                frameborder="0"
                //render width and height based on device type
                width={currDeviceType === DeviceType.TABLET ? 480 : 960}
                height={currDeviceType === DeviceType.TABLET ? 299 : 569}
                title={title}
                allowfullscreen="true"
                mozallowfullscreen="true"
                webkitallowfullscreen="true"
            />
        </div>
    )
}

export default function About() {

    const currDeviceType = GetDeviceType();

    return (
        <div className="about">
            <div className="aboutWrapper">
                <span className="aboutTitle">What is Book Club?</span>
                <p className="aboutDescription">
                    When searching through articles and recommendations on the internet, it's often difficult to gauge how highly thought of or accurate they are without an accurate scoring system.
                    Stack Overflow overcomes this problem through allowing each reputable user to contribute to a post's scoring system once.
                    Each user is also scored and the actions their allowed to perform, such as score another user's post, depend on their personal user score.
                    The project being coined as "Book Club" is a creative writing/blog platform where users can post their own writing.
                    Users can interact with one another's posts in different ways depending on their reputation, similar to Stack Overflow.
                    With a good enough reputation, users will be able to comment on posts, upvote/downvote posts and comments, and propose new categories and features.
                    A user's score will be dynamically altered according to the feedback their comments and posts receive.
                    Book Club should ultimately provide trusted content to allow site visitors to accurately determine fact from fiction, extending the Stack Overflow reputation system into more non-technical fields such as lifestyle tips, home maintenance, and general advice.
                    In addition, the users of Book Club will be given thoughtful feedback and a good gauge to determine what the community thinks of their work.
                </p>
                {currDeviceType !== DeviceType.PHONE &&
                    <>
                        {renderSlides(
                            "https://docs.google.com/presentation/d/e/2PACX-1vR09_leK1o_rWDyEh5y2XFQnewpAsDsH7KMYCTVN7Lp4-8DWj-ypn5XleNzpRVYkZQSVq8UcDPSt6d3/embed?start=false&loop=false&delayms=3000",
                            currDeviceType,
                            "The Proposal"
                        )}
                        {renderSlides(
                            "https://docs.google.com/presentation/d/e/2PACX-1vShrTKNKzTwxHvTcFZ5A-4l2wzBum1q6XTT2mueejTnUHgOC2UlhWxbQhwz94sbTPWOtEOG-zPvWs1D/embed?start=false&loop=false&delayms=3000",
                            currDeviceType,
                            "The Prototype"
                        )}
                        {renderSlides(
                            "https://docs.google.com/presentation/d/e/2PACX-1vQnoUQ7HHW5wVI7pFnDQSltu0UbBKyfYRBYms0yDKGJguyymDgLCxFtivHrPfr_48Yuaua6UbEh5iTy/embed?start=false&loop=false&delayms=3000",
                            currDeviceType,
                            "The Minimum Viable Product"
                        )}
                    </>
                }
                <div className="aboutContribution">
                    <span className="aboutContributionPhrase">Book Club is open source and accepting contributions</span>
                    <a
                        className="link"
                        href="https://github.com/SethCram/book-club"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <i class="aboutContributionIcon fa-brands fa-github"></i>
                    </a>
                </div>
                <div className="aboutContribution">
                    <span className="aboutContributionPhrase">Please share issues or feature recommendations</span>
                    <a
                        className="link"
                        href="https://github.com/SethCram/book-club/issues/new/choose"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <i class="aboutContributionIcon fa-solid fa-circle-exclamation"></i>
                    </a>
                </div>
            </div>
        </div>
  )
}
