import "./Comment.css"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { Context } from "../../context/Context";
import ReputationIcon from "../reputationIcon/ReputationIcon";

export default function Comment({ postId, comment = null, reply = false, template = false }) {
    const [replyIndex, setReplyIndex] = useState(-1); //init to outside arr bounds
    const [replyId, setReplyId] = useState("");
    const [feedback, setFeedback] = useState("");
    const { user } = useContext(Context);
    const [vote, setVote] = useState(null);

    const handleCommment = async (event, replyId = "", replyUsername = "") => {
        event.preventDefault();
        
        const newComment = {
            username: user.username,
            postId,
            description: feedback
        };

        if (replyId) {
            newComment["replyId"] = replyId;
        }

        if (replyUsername) {
            newComment["replyUsername"] = replyUsername;
        }

        try {
            const response = await axios.post("/comments/", newComment); 

            //refetch all comments
            //await getComments();

            //setLocalComments()

            console.log(response);
        } catch (error) {
            
        }
        
    };

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
      <div className={`commentContainer ${reply ? "commentReplyContainer" : ""}`}>
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
            {reply &&
                <span className="commentReplyTo">
                    @{comment?.replyUsername}
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
                        onClick={() => {/* setReplyIndex(i); */ setReplyId(comment._id); }}
                    >
                        Reply
                    </button>
                  ) : (
                    <>
                        <button
                            className="commentReply"
                            onClick={(event) => handleCommment(event)}
                            type="submit"
                        >
                            Confirm
                        </button>
                        <button
                            className="commentReply"
                            onClick={() => {setFeedback("")}}
                        >
                            Cancel
                        </button>  
                    </>          
                  )
                }
            </span>
        </div>
        
    </div>
  )
}
