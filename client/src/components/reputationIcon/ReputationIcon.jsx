import "./ReputationIcon.css"

export default function ReputationIcon({repScore, user = null, post = null, fromSideBar= false}) {
    const chooseReputationIconColor = () => {

        let badgeName;

        if (user) {
            badgeName = user.badgeName;
        } else if (post) {
            badgeName = post.badgeName;
        }

        switch (badgeName) {
            case "red":
                return "reddishBrown";
            case "bronze":
                return "bronze";
            case "silver":
                return "silver";
            case "gold":
                return "gold";
            case "platinum":
                return "platinum";
            default:
                return "";
        }
    }

    const chooseReputationIconShape = () => {
        if (user) {
            return "fa-solid fa-star";
        }
        else if (post) {
            return "fa-solid fa-diamond";
        }
    }

  return (
    <div className="fa-stack fa-xl">
        <i className={`${chooseReputationIconColor()} ${chooseReputationIconShape()} fa-xl`}></i>
          <div className={`${post ? "reputationNumberBox" : ""} fa fa-stack-1x`}>
            <div className={`${fromSideBar ? "reputationNumberSideBar" : "reputationNumberOther" } reputationNumber`}>
                {repScore}
            </div>
        </div>
    </div>
  )
}
