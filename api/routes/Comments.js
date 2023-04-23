const Comment = require("../models/Comment");
const Post = require("../models/Post");
const router = require("express").Router();
const { updateUserRep, verify } = require("./HelperFunctions");

//Create Comment
router.post("/", verify, async (request, response) => {

    const username = request.body.username;

    if (username !== request.user.username) {
        return response.status(401).json("You can only create a resource linked to your own username.");
    }

    try {
        //make sure linked post exists
        const post = await Post.findById(request.body.postId);
        if (post) {

            let createComment = true;

            let currReplyId = request.body?.replyId;

            let replyComment = null;

            //find the root comment being replied to
            while (currReplyId) {
                //find replied to comment
                replyComment = await Comment.findById(currReplyId);

                //make sure replied to comment exists
                if (!replyComment) {
                    createComment = false;
                    response.status(404).json("Replied to comment couldn't be found.");
                    break;
                }

                //look for next replied to comment
                currReplyId = replyComment.replyId;
            }

            //console.log(replyComment);

            if (createComment) {

                let updatedAuthor;

                //check if number of comments by user is gonna fall on a threshold value
                if ((((await Comment.countDocuments({ username })) + 1) % 10) === 0) {
                    updatedAuthor = await updateUserRep(
                        5,
                        username
                    );
                }

                const newComment = new Comment(request.body);
                const savedComment = await newComment.save();

                let rootComment = {}

                //if found a root comment being replied to
                if (replyComment) {
                    //add the newly created comment to its root comment's replies arr
                    rootComment = await Comment.findByIdAndUpdate(replyComment._id,
                        {
                            "$push": {
                                "replies": savedComment
                            }
                        },
                        { new: true }
                    );
                }

                response.status(201).json(
                    {
                        savedComment,
                        rootComment,
                        updatedUser: updatedAuthor
                    }
                );
            }
        }
        else {
            response.status(404).json("Post couldn't be found.");
        }

        
    } catch (error) {
        console.log(error)
        response.status(500).json(error);
    }
});

//Update Comment
router.put("/:commentId", verify, async (request, response) => { //async bc dont know how long it'll take
    
    try {
        const comment = await Comment.findById(request.params.commentId);

        //if comment exists
        if (comment)
        {
            //console.log(request.user);

            //if creator attempting to update, allow
            if ((comment.username === request.body.username &&
                comment.username === request.user.username) || 
                request.user.isAdmin)
            {

                console.log(request.body);

                //don't change the comment's author username
                let { username: _, ...newComment } = request.body;

                //if updater isn't an admin
                if (!request.user.isAdmin) {
                    //only let them change the comment's description
                    ({
                        reputation: _,
                        badgeName: _,
                        postId: _,
                        replyId: _,
                        replyUsername: _,
                        replies: _,
                        ...newComment } = newComment);
                }

                const updatedComment = await Comment.findByIdAndUpdate(
                    request.params.commentId,
                    {
                        $set: newComment,
                    }, 
                    { new: true }
                );
                response.status(200).json(updatedComment);
            }
            else
            {
                response.status(401).json("You can only update your own comment");
            }
        }
        else
        {
            response.status(404).json("No comment found");
        }

    } catch (error) {
        //console.log(error);
        response.status(500).json(error);
    }
}); 

//Delete Comment
router.delete("/:commentId", verify, async (request, response) => { //async bc dont know how long it'll take
    
    try {
        const comment = await Comment.findById(request.params.commentId);

        //if comment exists
        if (comment)
        {
            //if creator attempting to delete, allow
            if ((comment.username === request.body.username &&
                comment.username === request.user.username) || 
                request.user.isAdmin)
            {
                await comment.delete();
                response.status(200).json("Comment deleted");
            }
            else
            {
                response.status(401).json("You can only delete your own comment");
            }
        }
        else
        {
            response.status(404).json("No comment found");
        }

    } catch (error) {
        response.status(500).json(error);
    }
}); 

//Get All post root comments
router.get("/all/:postId", async (request, response) => {

    const postId = request.params.postId;

    const filter = {
        postId,
        replyId: { //dont want replies
            $exists: false
        }
    }
      
    try {
        //returns comments sorted by big -> small rep, if same rep than most recent -> oldest
        const comments = await Comment.find(filter)
            .sort({ reputation: "descending", updatedAt: "descending" }); 
        response.status(200).json(comments);
    } catch (error) {
        response.status(500).json(error);
    }
});

//Get One post's comment
router.get("/one/:commentId", async (request, response) => {

    const commentId = request.params.commentId;
      
    try {
        const comment = await Comment.findById(commentId); 
        if (comment) {
            response.status(200).json(comment);
        }
        else {
            response.status(404).json("Couldn't find comment");
        }
    } catch (error) {
        response.status(500).json(error);
    }
});



module.exports = router;