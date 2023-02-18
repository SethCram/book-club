const router = require("express").Router();
const Vote = require("../models/Vote");

//create vote
router.post("/vote", async (request, response) => {
    try {

        if (request.body.score !== 1 && request.body.score !== -1) {
            throw new Error("Score must be +1 or -1.");
        }

        const newVote = new Vote({
            score: request.body.score,
            linkedId: request.body.linkedId,
            authorId:request.body.authorId
        });

        const vote = await newVote.save();

        response.status(200).json(vote);
    } catch (error) {
        response.status(500).json(error);
    }
});

//update vote 
router.put("/:voteId", async (request, response) => {
    //ensure vote id's match
    if (request.body.voteId === request.params.voteId) {

        const vote = await Vote.findById(request.params.voteId);

        if (vote) {

            //allow altering of vote if requester is author (should prolly use JWT)
            if (vote.authorId.equals(request.body.authorId) )
            {
                try {
                    //ensure score set properly
                    if (request.body.score !== 1 && request.body.score !== -1) {
                        throw new Error("Score must be +1 or -1.");
                    }

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

                    response.status(200).json(updatedVote);
                } catch (error) {
                    response.status(500).json(error);
                } 
            }
            else
            {
                response.status(401).json("You can only update your own vote");
            }
        }
        else {
            response.status(404).json("No vote found");
        } 
    }
    else
    {
        response.status(401).json("You aren't updating the vote properly");
    }
});

module.exports = router;