import "./ReputationIcon.css"

export default function ReputationIcon({repScore, user = null, post = null, comment = null, numberClass = "", fromSideBar = false}) {
    const chooseReputationIconColor = () => {

        let badgeName;

        if (user) {
            badgeName = user.badgeName;
        } else if (post) {
            badgeName = post.badgeName;
        }
        else if (comment) {
            badgeName = comment.badgeName;
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
                return "black";
        }
    }

    const chooseReputationIconShape = () => {
        if (user) {
            return "fa-solid fa-star";
        }
        else if (post) {
            return "fa-solid fa-diamond";
        }
        else if (comment) {
            return "fa-solid fa-square";
        }
    }

  return (
    <div className="fa-stack fa-xl">
        <i className={`${chooseReputationIconColor()} ${chooseReputationIconShape()} fa-xl`}></i>
          <div className={`${post ? "reputationNumberBox" : ""} fa fa-stack-1x`}>
            <div className={`${fromSideBar ? "reputationNumberSideBar" : "reputationNumberOther" } ${numberClass} reputationNumber`}>
                {repScore}
            </div>
        </div>
    </div>
  )
}
