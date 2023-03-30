const router = require("express").Router();
const Badge = require("../models/Badge");
const Post = require("../models/Post");
const User = require("../models/User");
const Vote = require("../models/Vote");
const Comment = require("../models/Comment");
const mongoose = require("mongoose");

function sortedIndex(array, value) {

    var low = 0,
        high = array.length;

    while (low < high) {
        var mid = (low + high) >>> 1;
        if (array[mid].score <= value) low = mid + 1;
        else high = mid;
    }
    return low;
}


const updateUserRep = async (additionalScore, username) => {

    let searchParam;

    //setup searchParam depending on what's been passed in
    if (username) {
        searchParam = { username };
    }
    else {
        throw new Error("Requires a userId or username to find user.");
    }

    const user = await User.findOne(searchParam);

    //if user found
    if (user) {

        //calc new score
        const newScore = user.reputation + additionalScore;

        //default update filter incr's rep by additional score
        let updateFilter = {
            reputation: newScore
        }

        const ASC = 1;

        //get all badges + sort them in ascending order
        const allBadges = await Badge.find().sort({ score: ASC });

        //make sure badges were retrieved and increasing score
        if (allBadges && newScore > user.reputation) {
            
            //console.log(allBadges);
            //console.log(newScore);
            //console.log(user.reputation);

            //find where old+new scores would be inserted in ASC order arr
            let newScoreIndex = sortedIndex(allBadges, newScore);
            const oldScoreIndex = sortedIndex(allBadges, user.reputation);

            //console.log(newScoreIndex);
            //console.log(oldScoreIndex);

            //if new score inserted at higher spot than old score, new badge must be inserted
            if (newScoreIndex > oldScoreIndex) {
                //take care of score index if not zero
                if (newScoreIndex !== 0) {
                    newScoreIndex -= 1;
                }

                updateFilter["badgeName"] = allBadges[newScoreIndex].name; 
            }
        }

        //find the user and update their score
        const updatedUser = await User.findOneAndUpdate(
            searchParam,
            updateFilter, 
            { new: true })
        
        const { password, email, ...publicUser } = updatedUser._doc;
        
        return publicUser;
    }
    else
    {
        throw new Error("Couldn't find user to updated.")
    }
 }

//Update linked model always and author user if necessary
const updateLinkedModel = async (linkedId, score) => {
    //update linked post
    const post = await Post.findById(linkedId);

    let linkedModel;

    let rootComment = null;

    //set linked model to post or comment depending on which can be found
    if (post) {
        linkedModel = post;
    }
    else
    {
        const comment = await Comment.findById(linkedId);

        if (comment) {
            linkedModel = comment;

            let currReplyId = comment.replyId;

            //find the root comment being replied to
            while (currReplyId) {
                //find replied to comment
                rootComment = await Comment.findById(currReplyId);

                //make sure replied to comment exists
                if (!rootComment ) {
                    createComment = false;
                    response.status(404).json("Replied to comment couldn't be found.");
                    break;
                }

                //look for next replied to comment
                currReplyId = rootComment.replyId;
            }
        }
        else
        {
            throw new Error("Couldn't find linked Object by their id.");
        }
    }

    let updatedModel = {};
    let updatedAuthor = {};

    //calc new score by adding to post rep
    const newScore = linkedModel.reputation + score;

    //find badge if new score matches
    const newBadge = await Badge.findOne({
        score: newScore
    })

    let updateFilter = {
        reputation: newScore
    };

    let rootCommentUpdateFilter = {
        'replies.$.reputation': newScore
    }

    //if badge found to update
    if (newBadge) {
        //if no current badge, update w/ new badge
        if (!linkedModel.badgeName)
        {
            updateFilter["badgeName"] = newBadge.name;
            rootCommentUpdateFilter['replies.$.badgeName'] = newBadge.name;
            //update linked model's author thru increasing score by half the new badge's
            updatedAuthor = await updateUserRep(Math.round(newBadge.score / 2), username=linkedModel.username)
        }
        //if has badge name and trying to update it to a diff badge
        else if (linkedModel.badgeName != newBadge.name)
        {
            //retrieve post badge
            const currBadge = await Badge.findOne({
                name: linkedModel.badgeName
            })

            //if updating too a higher badge score, allow it
            if (currBadge.score < newBadge.score) {
                updateFilter["badgeName"] = newBadge.name;
                rootCommentUpdateFilter['replies.$.badgeName'] = newBadge.name;
                //update linked model's author thru increasing score by half the new badge's
                updatedAuthor = await updateUserRep(Math.round(newBadge.score / 2), username=linkedModel.username)
            }
        }
    }

    if (post) {
        updatedModel = await Post.findByIdAndUpdate(
            linkedId,
            {
                $set: updateFilter
            },
            { new: true }
        );
    }
    else {
        updatedModel = await Comment.findByIdAndUpdate(
            linkedId,
            {
                $set: updateFilter
            },
            { new: true }
        );

        //if root comment, update its replies 
        if (rootComment) {
            await Comment.findOneAndUpdate(
                {
                    _id: rootComment._id,
                    "replies._id": linkedId
                },
                {
                    $set: rootCommentUpdateFilter
                }
            );
            //console.log(updatedRootComment?.replies.filter(reply => reply._id.equals(linkedId) ));
        }
    }
    

    return [updatedModel, updatedAuthor];
    
};

//create vote and update linked post rep
router.post("/vote", async (request, response) => {
    
    const username = request.body.username;
    const linkedId = mongoose.Types.ObjectId(request.body.linkedId); //string, not obj id
    const score = request.body.score;
    
    try {

        if (score !== 1 && score !== -1) {
            //console.log(score);
            throw new Error("Score must be +1 or -1.");
        }

        //find a vote w/ user as author and same linkedId
        const foundDuplicateVote = await Vote.findOne({
            username,
            linkedId,
        });

        //if cant find duplicate vote
        if (!foundDuplicateVote)
        {
            //make sure requester isn't author of post
            //const authoredPost = await Post.findOne({})

            let updatedVoter;

            //check if number of votes by user is gonna fall on a threshold value
            if ((((await Vote.countDocuments({ username })) + 1) % 100) === 0) {
                updatedVoter = await updateUserRep(
                    10,
                    username
                );
            }

            //update linked post or comment rep and possibly author rep
            const [updatedLinkedModel, updatedAuthor] = await updateLinkedModel(
                linkedId,
                score
            );

            //create and save new vote
            const newVote = new Vote({
                score,
                linkedId,
                username
            });
    
            const vote = await newVote.save();
    
            response.status(201).json({
                vote,
                linkedModel: updatedLinkedModel,
                updatedAuthor,
                updatedVoter
            });
        }
        //if found duplicate vote
        else
        {
            response.status(403).json("Duplicate record can't be created.");
        }
        
    } catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
});


//update vote and update linked post rep
router.put("/update/:voteId", async (request, response) => {
    //ensure vote id's match
    if (request.body.voteId === request.params.voteId) {

        const vote = await Vote.findById(request.params.voteId);

        if (vote) {

            if (vote.score !== request.body.score) {

                //allow altering of vote if requester is author (should prolly use JWT)
                if (vote.username === request.body.username) {
                    try {

                        //calc how much new score differs from old one
                        const changeInVoteScoring = request.body.score - vote.score;

                        //update linked post or comment rep
                        const updatedModels = await updateLinkedModel(vote.linkedId, changeInVoteScoring);

                        //only allow updating of score
                        const updatedVote = await Vote.findByIdAndUpdate(
                            request.params.voteId,
                            {
                                $set: {
                                    score: request.body.score
                                }
                            },
                            { new: true }
                        );

                        response.status(200).json({
                            vote: updatedVote,
                            linkedModel: updatedModels[0],
                            updatedAuthor: updatedModels[1]
                        });
                    } catch (error) {
                        console.log(error);
                        response.status(500).json(error);
                    }
                }
                else {
                    response.status(401).json("You can only update your own vote");
                }
            }
            else
            {
                response.status(400).json("You can't update a vote using the same score");
            }
        }
        else {
            response.status(404).json("No vote found");
        } 
    }
    else
    {
        response.status(400).json("You aren't updating the vote properly");
    }
});

//get vote (only author should be able to get their votes) (should use JWT)
router.get("/get/", async (request, response) => {

    try {
        
        //find vote
        const vote = await Vote.findOne({
            username: request.query.username,
            linkedId: request.query.linkedId
        });

        if (vote && vote.length !== 0) {
            response.status(200).json(vote);
        }
        else {
            response.status(404).json("Can't find vote.");
        }
    } catch (error) {
        response.status(500).json(error);
    }
});

//Get All Vote (can be via username or linkedId or neither)
router.get("/", async (request, response) => {

    const username = request.query.username;
    const linkedId = request.query.linkedId;

    let filter = {};

    if (username) {
        filter["username"] = username;
    }

    if (linkedId) {
        filter["linkedId"] = linkedId;
    }

    try {
        
        //find all votes matching filter
        const votes = await Vote.find(filter);

        if (votes) {
            //abstract away author of votes 
            const anonVotes = votes.map((vote) => {
                const { username, ...publicVote } = vote._doc;
                return publicVote;
            });

            response.status(200).json(anonVotes);
        }
        else
        {
            response.status(404).json("No votes found.");
        }

    } catch (error) {
        response.status(500).json(error);
    }
})

module.exports = router;