const router = require("express").Router();
const Post = require("../models/Post");
const Vote = require("../models/Vote");

const updateLinkedModel = async (linkedId, score) => {
    //update linked post or comment
    const post = await Post.findById(linkedId);

    let updatedModel = {};

    if (post)
    {
        updatedModel = await Post.findByIdAndUpdate(
            linkedId,
            {
                $set: {
                    reputation: post.reputation + score
                }
            },
            { new: true }
        );
        console.log("made it here");
    }
    else
    {
        //UPDATE LINKED COMMENT 
        //const comment = await Comment.findById
    }

    return updatedModel;
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
            //update linked post or comment rep
            const updatedLinkedModel = await updateLinkedModel(request.body.linkedId, request.body.score);
            
            //create and save new vote
            const newVote = new Vote({
                score: request.body.score,
                linkedId: request.body.linkedId,
                authorId:request.body.authorId
            });
    
            const vote = await newVote.save();
    
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

//update vote and update linked post rep
router.put("/:voteId", async (request, response) => {
    //ensure vote id's match
    if (request.body.voteId === request.params.voteId) {

        const vote = await Vote.findById(request.params.voteId);

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
        response.status(400).json("You aren't updating the vote properly");
    }
});

module.exports = router;