const router = require("express").Router();
const mongoose = require("mongoose");
const Badge = require("../models/Badge");
const Post = require("../models/Post");
const User = require("../models/User");
const Vote = require("../models/Vote");

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


const updateUserRep = async (additionalScore, username = "", userId = "") => {

    let searchParam;

    //setup searchParam depending on what's been passed in
    if (username) {
        searchParam = { username };
        //console.log(username);
    }
    else if (userId) {
        searchParam = { _id: mongoose.Types.ObjectId(userId) };
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
            const newScoreIndex = sortedIndex(allBadges, newScore);
            const oldScoreIndex = sortedIndex(allBadges, user.reputation);

            //console.log(newScoreIndex);
            //console.log(oldScoreIndex);

            //if new score inserted at higher spot than old score, new badge must be inserted
            if (newScoreIndex > oldScoreIndex) {

                //find new badge using insertion index 
                const newBadge = await Badge.findOne({
                    score: allBadges[newScoreIndex-1].score //can go one index above bounds
                })

                //should always work but just incase
                if (newBadge) {
                    updateFilter["badgeName"] = newBadge.name; 
                    //console.log("update badge name to " + newBadge.name);
                }
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
    //update linked post or comment
    const post = await Post.findById(linkedId);

    let updatedModel = {};
    let updatedAuthor = {};

    if (post)
    {
        //calc new score by adding to post rep
        const newScore = post.reputation + score;

        //find badge if new score matches
        const newBadge = await Badge.findOne({
            score: newScore
        })

        let postUpdateFilter = {
            reputation: newScore
        };

        //if badge found to update
        if (newBadge) {
            //if no current badge on post, update post w/ new badge
            if (!post.badgeName)
            {
                postUpdateFilter["badgeName"] = newBadge.name;
                //update linked model's author thru increasing score by half the new badge's
                updatedAuthor = await updateUserRep(Math.round(newBadge.score / 2), username=post.username)
            }
            //if post has badge name and trying to update it to a diff badge
            else if (post.badgeName != newBadge.name)
            {
                //retrieve post badge
                const currPostBadge = await Badge.findOne({
                    name: post.badgeName
                })

                //if updating too a higher badge score, allow it
                if (currPostBadge.score < newBadge.score) {
                    postUpdateFilter["badgeName"] = newBadge.name;
                    //update linked model's author thru increasing score by half the new badge's
                    updatedAuthor = await updateUserRep(Math.round(newBadge.score / 2), username=post.username)
                }
            }
        }

        updatedModel = await Post.findByIdAndUpdate(
            linkedId,
            {
                $set: postUpdateFilter
            },
            { new: true }
        );
    }
    else
    {
        //UPDATE LINKED COMMENT LATER
        //const comment = await Comment.findById

        throw new Error("Couldn't find linked Object by their id.");
    }

    return [updatedModel, updatedAuthor];
    
};

//create vote and update linked post rep
router.post("/vote", async (request, response) => {
    
    const authorId = request.body.authorId;
    const linkedId = request.body.linkedId;
    const score = request.body.score;
    
    try {

        if (score !== 1 && score !== -1) {
            throw new Error("Score must be +1 or -1.");
        }

        //find a vote w/ user as author and same linkedId
        const foundDuplicateVote = await Vote.findOne({
            authorId,
            linkedId,
        });

        //if cant find duplicate vote
        if (!foundDuplicateVote)
        {
            //make sure requester isn't author of post
            //const authoredPost = await Post.findOne({})

            let updatedLinkedModel, updatedAuthor, updatedVoter;

            //check if number of votes by user is gonna fall on a threshold value
            if ((((await Vote.countDocuments({ authorId })) + 1) % 100) === 0) {
                updatedVoter = await updateUserRep(
                    10,
                    username= "", //not sure why but this is necessary
                    userId = authorId);
            }

            //update linked post or comment rep and possibly author rep
            const updatedModels = await updateLinkedModel(linkedId, score);
            updatedLinkedModel = updatedModels[0];
            updatedAuthor = updatedModels[1];

            //create and save new vote
            const newVote = new Vote({
                score,
                linkedId,
                authorId
            });
    
            const vote = await newVote.save();
    
            response.status(200).json({
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
        //console.log(error);
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
                if (vote.authorId.equals(request.body.authorId)) {
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
                        //console.log(error);
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
            authorId: request.query.authorId,
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

//Get All Vote (can be via authorId or linkedId or neither)
router.get("/", async (request, response) => {

    const userId = request.query.authorId;
    const linkedId = request.query.linkedId;

    let filter = {};

    if (userId) {
        filter["authorId"] = userId;
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
                const { authorId, ...publicVote } = vote._doc;
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