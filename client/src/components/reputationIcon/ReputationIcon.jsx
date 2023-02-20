import "./ReputationIcon.css"

export default function ReputationIcon({repScore, isUser = false, isPost = false, fromSideBar= false}) {
    const chooseReputationIconColor = (score) => {
        if (score < 0) {
            return "reddishBrown";
        }
        else if (score < 10)
        {
            return ""; //keep inherent black icon color
        }
        else if (score < 50)
        {
            return "bronze";    
        }
        else if (score < 100)
        {
            return "silver";    
        }
        else if (score < 500)
        {
            return "gold";    
        }
        else
        {
            return "platinum";    
        }
    }

    const chooseReputationIconShape = () => {
        if (isUser) {
            return "fa-solid fa-star";
        }
        else if (isPost) {
            return "fa-solid fa-diamond";
        }
    }

    const chooseReputationLetteringLocation = () => {
        if (isPost) {
            return "reputationNumberBox";
        }
        else if (fromSideBar)
        {
            return "reputationNumberSideBar";
        }
        else
        {
            return "";
        }
    }

  return (
    <div className="fa-stack fa-xl">
        <i className={`${chooseReputationIconColor(repScore)} ${chooseReputationIconShape()} fa-xl`}></i>
          <div className={`${isPost ? "reputationNumberBox" : ""} fa fa-stack-1x`}>
            <div className={`${fromSideBar ? "reputationNumberSideBar" : "reputationNumberOther" } reputationNumber`}>
                {repScore}
            </div>
        </div>
    </div>
  )
}
