import "./Comment.css"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { Context } from "../../context/Context";
import ReputationIcon from "../reputationIcon/ReputationIcon";

export default function Comment({ handleComment = null, handleReply = null, comment = null, replyId = "", replyUsername = ""}) {
    const [feedback, setFeedback] = useState("");
    const { user } = useContext(Context);
    const [vote, setVote] = useState(null);

    const chooseVoteIconClass = (desiredNumber, clearIcon) => {

        //if any vote cast
        if (vote) {
            //if vote cast is equal to desired number
            if (vote.score === desiredNumber) {
                return "icon-unlock";
            }
            else
            {
                return "icon-lock";
            }
        }
        //if no vote cast
        else
        {
            //display icon only if clear
           if (clearIcon) {
                return "icon-unlock";
            }
            else
            {
                return "icon-lock";
            } 
        }
    };

  return (
    <div className="comment">
        <div className={`commentContainer ${replyUsername ? "commentReplyContainer" : ""}`}>
            {/* author profile pic? */}

            <div className="commentIcons">
                <ReputationIcon
                    repScore={comment ? comment.reputation : 0}
                    comment={comment ? comment : { badgeName: ""}}
                    numberClass="commentRepNumbering"
                />
                {comment && //display icons if a pre-existing comment
                    <>
                        <div className="singlePostScoringIconCommentPairing lock">
                            <div className="singlePostScoringIconComment">
                                <i
                                    className={`${chooseVoteIconClass(0, true)} fa-regular fa-thumbs-up`}
                                    onClick={() => {/*handleVote(clearThumbsUpScore) */ }}
                                ></i>
                            </div>
                            <div className="singlePostScoringIconComment">
                                <i
                                    className={`${chooseVoteIconClass(1, false)} fa-solid fa-thumbs-up`}
                                    onClick={() => {/*handleVote(solidThumbsUpScore) */ }}
                                ></i>
                            </div>
                        </div>
                        <div className="singlePostScoringIconCommentPairing lock">
                            <div className="singlePostScoringIconComment">
                                <i
                                    className={`${chooseVoteIconClass(0, true)} fa-regular fa-thumbs-down`}
                                    onClick={() => {/*handleVote(clearThumbsDownScore) */ }}
                                ></i>
                            </div>
                            <div className="singlePostScoringIconComment">
                                <i
                                    className={`${chooseVoteIconClass(-1, false)} fa-solid fa-thumbs-down`}
                                    onClick={() => {/*handleVote(solidThumbsDownScore) */ }}
                                ></i>
                            </div>
                        </div>
                    </>
                }
            </div>
            
            <div className="commentContent">
                <span className="commentTitleRow">
                    
                    <h3 className="commentAuthor">
                        {comment ? comment.username: user.username}
                    </h3>
                    {comment && new Date(comment.updatedAt).toDateString()}
                </span>
                {replyUsername &&
                    <span className="commentReplyTo">
                        @{replyUsername}
                    </span>
                }
                {comment ? (
                    <p className="commentDescription">
                        {comment.description}
                    </p>
                )
                    :
                    (
                        <textarea 
                            className="commentTextArea"
                            placeholder="Enter your feedback..."
                            value={feedback}
                            onChange={text => setFeedback(text.target.value)}
                            required
                        />    
                    )
                }
                <span className="commentBottomRow">
                    {comment ? (
                        <button
                            className="commentReply"
                              onClick={() => { handleReply(comment._id); }}
                        >
                            Reply
                        </button>
                    ) : (
                        <>
                            <button
                                className="commentReply"
                                onClick={(event) => { handleComment(event, feedback, replyId, replyUsername); setFeedback(""); }}
                                type="submit"
                            >
                                Confirm
                            </button>
                            <button
                                className="commentReply"
                                onClick={() => {setFeedback("")}}
                            >
                                Clear
                            </button>  
                        </>          
                    )
                    }
                </span>
            </div>
            
        </div>
    </div>
  )
}
