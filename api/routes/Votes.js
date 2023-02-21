const router = require("express").Router();
const Badge = require("../models/Badge");
const Post = require("../models/Post");
const User = require("../models/User");
const Vote = require("../models/Vote");

const updateLinkedModelAuthorScore = async (username, additionalScore) => {
    //find the author and update their score
    const author = await User.findOneAndUpdate(
        {
            username
        },
        {
            $inc: {
                reputation: additionalScore
            }
        }, 
        { new: true }
    )

    return author;
 }

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
                updatedAuthor = await updateLinkedModelAuthorScore(post.username, Math.round(newBadge.score / 2))
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
                    updatedAuthor = await updateLinkedModelAuthorScore(post.username, Math.round(newBadge.score / 2))
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
        //UPDATE LINKED COMMENT 
        //const comment = await Comment.findById
    }

    //if an updated author
    if (Object.keys(updatedAuthor).length !== 0) {
        //abstract away their pass and email fields
        const { password, email, ...others } = updatedAuthor._doc;
        return [updatedModel, others];
    }
    //if author not updated
    else
    {
        return [updatedModel, updatedAuthor];
    }
    
};

//create vote and update linked post rep
router.post("/vote", async (request, response) => {
    try {

        if (request.body.score !== 1 && request.body.score !== -1) {
            throw new Error("Score must be +1 or -1.");
        }

        //find a vote w/ user as author and same linkedId
        const foundDuplicateVote = await Vote.findOne({
            authorId: request.body.authorId,
            linkedId: request.body.linkedId,
        });

        //if cant find duplicate vote
        if (!foundDuplicateVote)
        {
            //make sure requester isn't author of post
            //const authoredPost = await Post.findOne({})

            //update linked post or comment rep and possibly author rep
            const updatedModels = await updateLinkedModel(request.body.linkedId, request.body.score);

            //create and save new vote
            const newVote = new Vote({
                score: request.body.score,
                linkedId: request.body.linkedId,
                authorId:request.body.authorId
            });
    
            const vote = await newVote.save();
    
            response.status(200).json({
                vote,
                linkedModel: updatedModels[0],
                updatedAuthor: updatedModels[1]
            });
        }
        //if found duplicate vote
        else
        {
            response.status(403).json("Duplicate record can't be created.");
        }
        
    } catch (error) {
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

/*
//update vote and update linked post rep
router.put("/update/:authorId", async (request, response) => {
    //ensure author id's match
    if (request.body.authorId === request.params.authorId) {

        const vote = await Vote.findOne({
            authorId: request.body.authorId,
            linkedId: request.body.linkedId
        });

        console.log(vote);

        if (vote) {

            if (vote.score !== request.body.score) {

                //allow altering of vote if requester is author (should prolly use JWT)
                if (vote.authorId.equals(request.body.authorId)) {
                    try {
                        //ensure score set properly
                        if (request.body.score !== 1 && request.body.score !== -1) {
                            throw new Error("Score must be +1 or -1.");
                        }

                        //update linked post or comment rep
                        const updatedLinkedModel = await updateLinkedModel(vote.linkedId, request.body.score);

                        //only allow updating of score
                        const updatedVote = await Vote.findOneAndUpdate(
                            {
                                authorId: request.body.authorId,
                                linkedId: request.body.linkedId
                            },
                            {
                                $set: {
                                    score: request.body.score
                                }
                            },
                            { new: true }
                        );

                        response.status(200).json({
                            vote: updatedVote,
                            linkedModel: updatedLinkedModel
                        });
                    } catch (error) {
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
        response.status(401).json("You can only update your own vote");
    }
});
*/

//get vote (only author should be able to get their votes) (should use JWT)
router.get("/get/", async (request, response) => {

    try {
        
        //find vote
        const vote = await Vote.find({
            authorId: request.query.authorId,
            linkedId: request.query.linkedId
        });

        if (vote && vote.length !== 0) {
            response.status(200).json(vote[0]);
        }
        else {
            response.status(404).json("Can't find vote.");
        }
    } catch (error) {
        response.status(500).json(error);
    }
});

/*
//create/update vote and update linked post rep
router.post("/upsert", async (request, response) => {
    try {

        if (request.body.score !== 1 && request.body.score !== -1) {
            throw new Error("Score must be +1 or -1.");
        }

        //find a vote w/ user as author and same linkedId
        const foundDuplicateVote = await Vote.findOne({
            authorId: request.body.authorId,
            linkedId: request.body.linkedId,
        });

        //if cant find duplicate vote
        if (!foundDuplicateVote)
        {
            //update linked post or comment rep
            const updatedLinkedModel = await updateLinkedModel(request.body.linkedId, request.body.score);

            //create and save new vote
            const vote = Vote.updateOne(
                {
                    score: request.body.score,
                    linkedId: request.body.linkedId,
                    authorId:request.body.authorId
                },
                {
                    $set: {
                        score: request.body.score
                    }
                },
                { upsert: true, new: true  }
            );
    
            response.status(200).json({
                vote,
                linkedModel: updatedLinkedModel
            });
        }
        //if found duplicate vote
        else
        {
            response.status(403).json("Duplicate record can't be created.");
        }
        
    } catch (error) {
        response.status(500).json(error);
    }
});
*/

module.exports = router;