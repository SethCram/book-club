import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/Context";
import axios from "axios"
import "./Vote.css"
import { UserUpdateFailure, UserUpdateStart, UserUpdateSuccessful } from "../../context/Actions";
import { getAxiosAuthHeaders } from "../../App";

export const VoteType = {
    NONE: 0,
    UPVOTE: 1,
    DOWNVOTE: -1
}

export default function Vote({
    voteType, hollowIcon,
    setVote, setVoteErrorMsg, setUpdatedAuthor, setUpdatedLinkedModel,
    linkedId,
    existingVote = null
}) {
    const { user, dispatch } = useContext(Context);
    const [scoreChange, setScoreChange] = useState(0);
    const [voteIconClasses, setVoteIconClasses] = useState("");

    useEffect(() => {

        const getScore = () => {

            //if upvote
            if (voteType === VoteType.UPVOTE) {
                
                //if hollow upvote
                if (hollowIcon) {
                    setScoreChange(VoteType.UPVOTE);
                } 
                //if solid upvote
                else {
                    setScoreChange(VoteType.NONE);
                }
            }
            //if downvote
            else if (voteType === VoteType.DOWNVOTE) {
                
                //if hollow downvote
                if (hollowIcon) {
                    setScoreChange(VoteType.DOWNVOTE);
                } 
                //if solid downvote
                else {
                    setScoreChange(VoteType.NONE);
                }
            }
        }
        getScore();
        
    }, [voteType, user?.reputation, hollowIcon])

    useEffect(() => {
        const chooseVoteIconClasses = () => {

            let classNames = "";
            let iconScore = 0;
    
            //assign icon type
            if (voteType === VoteType.UPVOTE) {
                classNames += 'fa-thumbs-up ';
                //solid upvote is 1 score
                iconScore = VoteType.UPVOTE;
            }
            else if (voteType === VoteType.DOWNVOTE) {
                classNames += 'fa-thumbs-down ';
                //solid downvote is -1 score
                iconScore = VoteType.DOWNVOTE;
            }
    
            //assign icon coloring
            if (hollowIcon) {
                classNames += 'fa-regular ';
                //either downvote or upvote score is a 0
                iconScore = VoteType.NONE;
            }
            else {
                classNames += 'fa-solid ';
            }
    
            //if any vote cast
            if (existingVote) {
                //if vote cast is equal to icon score
                if (existingVote.score === iconScore) {
                    //show icon
                    classNames += "icon-lock";
                }
                else
                {
                    classNames += "icon-unlock";
                }
            }
            //if no vote cast
            else
            {
                //if clear icon
                if (hollowIcon) {
                    //show icon
                    classNames += "icon-lock";
                }
                else
                {
                    classNames += "icon-unlock";
                } 
            }
    
            setVoteIconClasses(classNames);
        }
        chooseVoteIconClasses();

    }, [existingVote, hollowIcon, voteType])
    
    const handleVote = async () => {

        setVoteErrorMsg("");

        let updateVote = {
            score: scoreChange,
            linkedId: linkedId,
            username: user.username
        };

        let voteObject;

        try {

            const [axiosAuthHeaders, _] = await getAxiosAuthHeaders(user, dispatch);

            if (existingVote) {

                updateVote["voteId"] = existingVote._id;

                //update vote w/ new score
                voteObject = await axios.put(`/votes/update/${existingVote._id}`,
                    updateVote,
                    axiosAuthHeaders
                );
            }
            else
            {
                //create new vote
                voteObject = await axios.post("/votes/vote",
                    updateVote,
                    axiosAuthHeaders
                ); 
            }

            //if linkedModel badgeName, update it locally 
            if (voteObject.data.linkedModel.badgeName) {
                //post["badgeName"] = voteObject.data.linkedModel.badgeName;
                setUpdatedLinkedModel(voteObject.data.linkedModel);
            }

            const updatedAuthor = voteObject.data.updatedAuthor;

            if (Object.keys(updatedAuthor).length > 0) {

                //need to update sidebar user reputation
                console.log("Sidebar author rep should be updated");
                setUpdatedAuthor(updatedAuthor);

                //update us if we're the one who's rep changed
                if (updatedAuthor.username === user.username) {
                    
                    try {
                        dispatch(UserUpdateStart());

                        const newUser = { ...user, ...updatedAuthor };

                        dispatch(UserUpdateSuccessful(newUser));
                    } catch (error) {
                        dispatch(UserUpdateFailure());
                    }

                }
            }

            //set new vote properly
            setVote(voteObject.data.vote);

        } catch (error) {
            //if bad request
            if (error.response.status === 400) {
                //tell client error
                setVoteErrorMsg(error.response.data);
            }
            //console.log(error);
        } 
    };

    return (
        <i 
            className={`voteScoringIcon ${voteIconClasses}`}
            onClick={() => {handleVote() }}
        ></i>
    )
}
