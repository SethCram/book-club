import "./About.css"
import { DeviceType, GetDeviceType } from "../../components/topbar/TopBar";

export default function About() {

    let currDeviceType = GetDeviceType();

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
                    <iframe title="iframeProposalSlides" src="https://docs.google.com/presentation/d/e/2PACX-1vR09_leK1o_rWDyEh5y2XFQnewpAsDsH7KMYCTVN7Lp4-8DWj-ypn5XleNzpRVYkZQSVq8UcDPSt6d3/embed?start=true&loop=true&delayms=3000" frameborder="0" width="480" height="299" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
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
