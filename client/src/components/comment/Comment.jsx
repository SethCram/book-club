import "./Comment.css"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { Context } from "../../context/Context";
import ReputationIcon from "../reputationIcon/ReputationIcon";
import { Link } from "react-router-dom";
import Vote, { VoteType } from "../vote/Vote";
import { getAxiosAuthHeaders } from "../../App";

export default function Comment({
    handleComment = null, handleReply = null,
    comment = null, replyId = "", replyUsername = "",
    setUpdatedCommentAuthor = null, getComments = null }) {
    const [feedback, setFeedback] = useState("");
    const { user, dispatch } = useContext(Context);
    const [vote, setVote] = useState(null);
    const [repScore, setRepScore] = useState(0);
    const [writeMode, setWriteMode] = useState(false);
    const [voteErrorMsg, setVoteErrorMsg] = useState("");
    const [updatedComment, setUpdatedComment] = useState(null);

    useEffect(() => {
        const getVote = async () => {
            try {
                //get vote
                const vote = await axios.get(`/api/votes/get/`, {
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

    useEffect(() => {
        if (updatedComment) {
            setRepScore(updatedComment.reputation);

            if (updatedComment.badgeName) {
                comment.badgeName = updatedComment.badgeName;
            }
        }
        
    }, [updatedComment]);

    const handleUpdate = async () => {

        try {

            const [axiosAuthHeaders, _] = await getAxiosAuthHeaders(user, dispatch);

            //update comment in DB
            await axios.put(`/api/comments/${comment._id}`,
                {
                    username: user.username,
                    description: feedback
                },
                axiosAuthHeaders
            );

            //update comment locally
            comment.description = feedback;

            //disable editing mode
            setWriteMode(false);
        } catch (error) {
            
        }
    }

    const handleConfirm = (event) => {
        event.preventDefault();

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

    function renderUsername(comment) {
        let retdUsername;
        
        if (comment) {
            retdUsername = comment.username;
        } else {
            retdUsername = user.username;
        } 

        return retdUsername
    }

    const handleDeletion = async () => {
        try {

            const [axiosAuthHeaders, _] = await getAxiosAuthHeaders(user, dispatch);

            await axios.delete("/api/comments/" + comment._id,
                {
                    data: { username: user.username },
                    headers: axiosAuthHeaders.headers
                }
            )

            await getComments();

        } catch (error) {
            
        }
    };

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
                    {comment && user && //display icons if a pre-existing comment
                        <>
                            <div className="commentVoteIcon">
                                <Vote 
                                  voteType={VoteType.UPVOTE}
                                  hollowIcon={true}
                                  setVote={setVote}
                                  setVoteErrorMsg={setVoteErrorMsg} 
                                  setUpdatedLinkedModel={setUpdatedComment}
                                  setUpdatedAuthor={setUpdatedCommentAuthor}
                                  linkedId={comment?._id}
                                  existingVote={vote}
                                />
                            </div>
                            <div className="commentVoteIcon">
                                <Vote 
                                  voteType={VoteType.UPVOTE}
                                  hollowIcon={false}
                                  setVote={setVote}
                                  setVoteErrorMsg={setVoteErrorMsg} 
                                  setUpdatedLinkedModel={setUpdatedComment}
                                  setUpdatedAuthor={setUpdatedCommentAuthor}
                                  linkedId={comment?._id}
                                  existingVote={vote}
                                />
                            </div>
                            <div className="commentVoteIcon">
                                <Vote 
                                  voteType={VoteType.DOWNVOTE}
                                  hollowIcon={true}
                                  setVote={setVote}
                                  setVoteErrorMsg={setVoteErrorMsg} 
                                  setUpdatedLinkedModel={setUpdatedComment}
                                  setUpdatedAuthor={setUpdatedCommentAuthor}
                                  linkedId={comment?._id}
                                  existingVote={vote}
                                />
                            </div>
                            <div className="commentVoteIcon">
                                <Vote 
                                  voteType={VoteType.DOWNVOTE}
                                  hollowIcon={false}
                                  setVote={setVote}
                                  setVoteErrorMsg={setVoteErrorMsg} 
                                  setUpdatedLinkedModel={setUpdatedComment}
                                  setUpdatedAuthor={setUpdatedCommentAuthor}
                                  linkedId={comment?._id}
                                  existingVote={vote}
                                />
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
                        {comment && (comment.username === user?.username || user?.isAdmin) && !writeMode && 
                            <div>
                                <i
                                    className="commentButton commentUpdate fa-regular fa-pen-to-square"
                                    onClick={() => { setWriteMode(true); setFeedback(comment.description); }}
                                />
                                <i
                                    className="commentButton commentDelete fa-regular fa-trash-can"
                                    onClick={handleDeletion}
                                />
                            </div>
                        }
                    </span>
                    {replyUsername &&
                        <span className="commentReplyTo">
                            @{replyUsername}
                        </span>
                    }
                    {voteErrorMsg &&
                        <span className="responseMsg errorText">
                            {voteErrorMsg}
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
