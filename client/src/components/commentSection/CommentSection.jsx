import "./CommentSection.css"
import { useEffect, useState } from "react"
import axios from "axios"
import Comment from "../comment/Comment";

export default function CommentSection({postId}) {
    const [comments, setComments] = useState([]);
    const [replyIndex, setReplyIndex] = useState(-1); //init to outside arr bounds

    useEffect(() => {
        const getComments = async () => {
            const response = await axios.get("/comments/all/" + postId);
            setComments(response.data);
        };
        if (postId) {
            getComments();
        }

    }, [postId]);

    return (
        <div className="commentSection">
            <Comment postId={postId} template={true} />

            {comments.length > 0 && 
                comments.map((comment, i) => (
                    <div key={comment._id}>
                        <Comment postId={postId} comment={comment}/>
                        
                        {replyIndex === i && 
                            <Comment postId={postId} reply={true} template={true} />
                        }
                            {comment.replies.length > 0 && comment.replies.map((reply, j) => (
                            <div key = {reply._id}>
                                <Comment postId={postId} comment={reply} reply={true} />                             
                            </div>
                        ))
                        }
                    </div>
                ))
            }
        </div>
    )
            
}
