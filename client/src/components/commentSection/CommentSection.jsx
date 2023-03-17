import "./CommentSection.css"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import Comment from "../comment/Comment";
import { Context } from "../../context/Context";

export default function CommentSection({post, setUpdatedPostAuthor}) {
    const [comments, setComments] = useState([]);
    const [replyId, setReplyId] = useState("");
    const [updatedCommentAuthor, setUpdatedCommentAuthor] = useState(null);
    const { user } = useContext(Context);

    useEffect(() => {
        const getComments = async () => {
            const response = await axios.get("/comments/all/" + post._id);
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
    }, [updatedCommentAuthor])

    const getComments = async () => {
        const response = await axios.get("/comments/all/" + post._id);
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
            const response = await axios.post("/comments/", newComment); 

            //refetch all comments
            await getComments();

            //setLocalComments()
        } catch (error) {
            
        }
        
    };

    const handleReply = (replyId) => {
        //create another comment below the requested comment
        // but how to figure out what the requested comment is?

        setReplyId(replyId);
    };

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
                        />
                        
                        {replyId === comment._id && user &&
                            <Comment handleComment={handleComment} postId={post?._id} replyId={comment._id} replyUsername={comment.username}/>
                        }

                        {comment.replies.length > 0 && comment.replies.map((reply) => ( //render every reply to the root comment
                            <div key = {reply._id}>
                                <Comment
                                    postId={post?._id}
                                    handleReply={handleReply}
                                    comment={reply}
                                    replyId={reply.replyId}
                                    replyUsername={reply.replyUsername}
                                    setUpdatedCommentAuthor = { setUpdatedCommentAuthor }
                                />  
                                {replyId === reply._id && user &&
                                    <Comment handleComment={handleComment} postId={post?._id} replyId={reply._id} replyUsername={reply.username}/>
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
