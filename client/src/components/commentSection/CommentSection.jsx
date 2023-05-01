import "./CommentSection.css"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import Comment from "../comment/Comment";
import { Context } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import { UserUpdateFailure, UserUpdateStart, UserUpdateSuccessful } from "../../context/Actions";
import { getAxiosAuthHeaders } from "../../App";

export default function CommentSection({post, setUpdatedPostAuthor}) {
    const [comments, setComments] = useState([]);
    const [replyId, setReplyId] = useState("");
    const [updatedCommentAuthor, setUpdatedCommentAuthor] = useState(null);
    const { user, dispatch } = useContext(Context);
    const nagivate = useNavigate();

    useEffect(() => {
        const getComments = async () => {
            const response = await axios.get("/api/comments/all/" + post._id);
            setComments(response.data);
        };
        if (post?._id) {
            getComments();
        }

    }, [post?._id]);

    useEffect(() => {
        //if comment author is the post author
        if (post?.username === updatedCommentAuthor?.username) {
            //update the post author thru sidebar
            setUpdatedPostAuthor(updatedCommentAuthor);
        }
    }, [updatedCommentAuthor, post, setUpdatedPostAuthor])

    const getComments = async () => {
        const response = await axios.get("/api/comments/all/" + post._id);
        setComments(response.data);
    }

    const handleComment = async (event, feedback, replyToId = "", replyUsername = "") => {
        event.preventDefault();
        
        const newComment = {
            username: user.username,
            postId: post._id,
            description: feedback
        };

        if (replyToId) {
            newComment["replyId"] = replyToId;

            //clear reply Id to wipe out comment template
            setReplyId("");
        }

        if (replyUsername) {
            newComment["replyUsername"] = replyUsername;
        }

        try {

            const [axiosAuthHeaders, tokens] = await getAxiosAuthHeaders(user, dispatch);

            const response = await axios.post("/api/comments/",
                newComment,
                axiosAuthHeaders); 

            const updatedAuthor = response.data.updatedUser;

            //update post author if applicable
            if (updatedAuthor?.username === post.username) {
                setUpdatedPostAuthor(updatedAuthor);
            }

            //if we require updating
            // update us if we're the one who's rep changed
            if (updatedAuthor?.username === user.username) {

                //console.log(`updating user rep to ${updatedAuthor.reputation}`);
                        
                try {
                    dispatch(UserUpdateStart());

                    const newUser = { ...user, ...updatedAuthor };

                    //make sure the tokens are correct on new user
                    newUser['accessToken'] = tokens.accessToken;
                    newUser['refreshToken'] = tokens.refreshToken;

                    dispatch(UserUpdateSuccessful(newUser));
                } catch (error) {
                    //console.log(error);
                    dispatch(UserUpdateFailure());
                }

            }

            //refetch all comments
            await getComments();

            //setLocalComments()
        } catch (error) {
            
        }
        
    };

    const handleReply = (replyingToId) => {

        if (user) {
            setReplyId(replyingToId);
        }
        else {
            nagivate("/login");
        }
        
    };

    //for printing out nested objs
    /*
    function printValues(obj) {
        for (var key in obj) {
            if (typeof obj[key] === "object") {
                printValues(obj[key]);   
            } else {
                console.log(key, obj[key]);    
            }
        }
    }
    */

    return (
        <div className="commentSection">
            {user &&
                <Comment handleComment={handleComment} postId={post?._id} />
            }
            {comments.length > 0 && //render every comment
                comments.map((comment) => (
                    <div key={comment._id}>
                        <Comment
                            postId={post?._id}
                            handleReply={handleReply}
                            comment={comment}
                            setUpdatedCommentAuthor={setUpdatedCommentAuthor}
                            getComments={getComments}
                        />
                        {replyId === comment._id && user && //new comments above and below this line
                            <Comment
                                handleComment={handleComment}
                                postId={post?._id}
                                replyId={comment._id}
                                replyUsername={comment.username} 
                            />
                        }

                        {comment.replies.length > 0 && comment.replies.map((reply) => ( //render every reply to the root comment
                            <div key={reply._id}>
                                <Comment
                                    postId={post?._id}
                                    handleReply={handleReply}
                                    comment={reply}
                                    replyId={reply.replyId}
                                    replyUsername={reply.replyUsername}
                                    setUpdatedCommentAuthor = { setUpdatedCommentAuthor }
                                    getComments={getComments}
                                />  
                                {replyId === reply._id && user && //new comment
                                    <Comment
                                        handleComment={handleComment}
                                        postId={post?._id} replyId={reply._id}
                                        replyUsername={reply.username} 
                                    />
                                }
                            </div>
                        ))
                        }
                    </div>
                ))
            }
        </div>
    )
            
}
