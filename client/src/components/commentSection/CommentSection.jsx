import "./CommentSection.css"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import Comment from "../comment/Comment";
import { Context } from "../../context/Context";

export default function CommentSection({postId}) {
    const [comments, setComments] = useState([]);
    const [replyId, setReplyId] = useState("");
    const { user } = useContext(Context);

    useEffect(() => {
        const getComments = async () => {
            const response = await axios.get("/comments/all/" + postId);
            setComments(response.data);
        };
        if (postId) {
            getComments();
        }

    }, [postId]);

    const getComments = async () => {
        const response = await axios.get("/comments/all/" + postId);
        setComments(response.data);
    }

    const handleComment = async (event, feedback, replyToId = "", replyUsername = "") => {
        event.preventDefault();
        
        const newComment = {
            username: user.username,
            postId,
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
                <Comment handleComment={handleComment} postId={postId} />
            }
            {comments.length > 0 && //render every comment
                comments.map((comment) => (
                    <div key={comment._id}>
                        <Comment postId={postId} handleReply={handleReply} comment={comment}/>
                        
                        {replyId === comment._id && user &&
                            <Comment handleComment={handleComment} postId={postId} replyId={comment._id} replyUsername={comment.username}/>
                        }

                        {comment.replies.length > 0 && comment.replies.map((reply) => ( //render every reply to the root comment
                            <div key = {reply._id}>
                                <Comment postId={postId} handleReply={handleReply} comment={reply} replyId={reply.replyId} replyUsername={reply.replyUsername} />  
                                {replyId === reply._id && user &&
                                    <Comment handleComment={handleComment} postId={postId} replyId={reply._id} replyUsername={reply.username}/>
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
