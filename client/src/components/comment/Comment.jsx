import "./Comment.css"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { Context } from "../../context/Context";
import ReputationIcon from "../reputationIcon/ReputationIcon";
import { Link } from "react-router-dom";

export default function Comment({ handleComment = null, handleReply = null, comment = null, replyId = "", replyUsername = "", setUpdatedCommentAuthor = null }) {
    const [feedback, setFeedback] = useState("");
    const { user } = useContext(Context);
    const [vote, setVote] = useState(null);
    const [repScore, setRepScore] = useState(0);
    const [writeMode, setWriteMode] = useState(false);

    const clearThumbsUpScore = 1;
    const solidThumbsUpScore = 0;
    const clearThumbsDownScore = -1;
    const solidThumbsDownScore = 0;

    useEffect(() => {
        const getVote = async () => {
            try {
                //get vote
                const vote = await axios.get(`/votes/get/`, {
                    params: {
                        username: user.username,
                        linkedId: comment._id
                    }
                });

                setVote(vote.data);
            }
            catch (error) {
                //console.log(error);
            }
        };
        if (user && comment) {
            getVote();
        }
    }, [comment, user])

    useEffect(() => {
        if (comment) {
            setRepScore(comment.reputation);
        }
        
    }, [comment]);

    const handleVote = async (score) => {

        //console.log(score);

        let voteObject;

        let changeInVoteScoring;

        try {

            if (vote) {
                //update vote w/ new score
                voteObject = await axios.put(`/votes/update/${vote._id}`, {
                    score,
                    linkedId: comment._id,
                    voteId: vote._id,
                    username: user.username
                });

                changeInVoteScoring = voteObject.data.vote.score - vote.score
            }
            else {
                //create new vote
                voteObject = await axios.post("/votes/vote", {
                    score,
                    linkedId: comment._id,
                    username: user.username
                });

                changeInVoteScoring = voteObject.data.vote.score;
            }

            //if linkedModel badgeName, update it locally 
            if (voteObject.data.linkedModel.badgeName) {
                comment["badgeName"] = voteObject.data.linkedModel.badgeName;
            }

            if (Object.keys(voteObject.data.updatedAuthor).length > 0) {
                //need to update sidebar user reputation somehow 
                console.log("Sidebar author rep should be updated");

                setUpdatedCommentAuthor(voteObject.data.updatedAuthor);
            }

            //set new vote properly
            setVote(voteObject.data.vote);

            //change local post rep score
            setRepScore(repScore + changeInVoteScoring);

        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdate = async () => {

        try {
            //update comment in DB
            await axios.put(`/comments/${comment._id}`, {
                username: user.username,
                description: feedback
            });

            //update comment locally
            comment.description = feedback;

            //disable editing mode
            setWriteMode(false);
        } catch (error) {
            
        }
    }

    const handleConfirm = (event) => {

        if (!feedback) {
            return;
        }

        //if confirming an edit
        if (writeMode) {
            handleUpdate();
        }
        //confirming a new comment
        else {
            handleComment(event, feedback, replyId, replyUsername);
        }

        setFeedback("");
    };

    const chooseVoteIconClass = (desiredNumber, clearIcon) => {

        //if any vote cast
        if (vote) {
            //if vote cast is equal to desired number
            if (vote.score === desiredNumber) {
                return "icon-lock";
            }
            else {
                return "icon-unlock";
            }
        }
        //if no vote cast
        else {
            //display icon only if clear
            if (clearIcon) {
                return "icon-lock";
            }
            else {
                return "icon-unlock";
            }
        }
    };

    function renderUsername(comment) {
        let retdUsername;
        
        if (comment) {
            retdUsername = comment.username;
        } else {
            retdUsername = user.username;
        } 

        return retdUsername
    }

    return (
        <div className="comment">
            <div className={`commentContainer ${replyUsername ? "commentReplyContainer" : ""}`}>
                {/* author profile pic? */}

                <div className="commentIcons">
                    <ReputationIcon
                        repScore={comment ? repScore : 0}
                        comment={comment ? comment : { badgeName: "" }}
                        numberClass="commentRepNumbering"
                    />
                    {comment && //display icons if a pre-existing comment
                        <>
                            <div className="commentVoteIcon">
                                <i
                                    className={`${chooseVoteIconClass(0, true)} fa-regular fa-thumbs-up`}
                                    onClick={() => { handleVote(clearThumbsUpScore) }}
                                ></i>
                            </div>
                            <div className="commentVoteIcon">
                                <i
                                    className={`${chooseVoteIconClass(1, false)} fa-solid fa-thumbs-up`}
                                    onClick={() => { handleVote(solidThumbsUpScore) }}
                                ></i>
                            </div>
                            <div className="commentVoteIcon">
                                <i
                                    className={`${chooseVoteIconClass(0, true)} fa-regular fa-thumbs-down`}
                                    onClick={() => { handleVote(clearThumbsDownScore) }}
                                ></i>
                            </div>
                            <div className="commentVoteIcon">
                                <i
                                    className={`${chooseVoteIconClass(-1, false)} fa-solid fa-thumbs-down`}
                                    onClick={() => { handleVote(solidThumbsDownScore) }}
                                ></i>
                            </div>
                        </>
                    }
                </div>
            
                <div className="commentContent">
                    <span className="commentTitleRow">
                    
                        <h3 className="commentAuthor">
                            <Link
                                to={`/?username=${renderUsername(comment)}`}
                                className="link"
                            >
                                {renderUsername(comment)}
                            </Link>
                        </h3>
                        {comment && new Date(comment.updatedAt).toDateString()}
                        {comment?.username === user?.username && !writeMode &&
                            <button
                                type="submit"
                                className="commentButton commentUpdate"
                                onClick={() => { setWriteMode(true); setFeedback(comment.description); }}
                            >
                                <strong>Update</strong>
                            </button>
                        }
                    </span>
                    {replyUsername &&
                        <span className="commentReplyTo">
                            @{replyUsername}
                        </span>
                    }
                    {(comment && !writeMode) ? (
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
                                autoFocus
                            />
                        )
                    }
                    <span className="commentBottomRow">
                        {(comment && !writeMode) ? (
                            <button
                                className="commentButton"
                                onClick={() => { handleReply(comment._id); }}
                            >
                               <strong>Reply</strong>
                            </button>
                        ) : (
                            <>
                                <button
                                    className="commentButton"
                                    onClick={handleConfirm}
                                    type="submit"
                                >
                                    <strong>Confirm</strong>
                                </button>
                                <button
                                    className="commentButton"
                                    onClick={() => { setFeedback("") }}
                                >
                                    <strong>Clear</strong>
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
