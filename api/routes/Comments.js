const Comment = require("../models/Comment");
const Post = require("../models/Post");
const router = require("express").Router();

//Create
router.post("/", async (request, response) => {
    try {
        //make sure linked post exists
        const post = await Post.findById(request.body.postId);
        if (post) {

            let createComment = true;

            //make sure replied to comment exists
            if (request.body.replyId) {
                const replyComment = await Comment.findById(request.body.replyId);

                if (!replyComment) {
                    createComment = false;
                    response.status(404).json("Replied to comment couldn't be found.");
                }
                
            }

            if (createComment) {
                const newComment = new Comment(request.body);
                const savedComment = await newComment.save();
                response.status(200).json(savedComment);
            }
        }
        else {
            response.status(404).json("Post couldn't be found.");
        }

        
    } catch (error) {
        response.status(500).json(error);
    }
});

//Update Comment
router.put("/:commentId", async (request, response) => { //async bc dont know how long it'll take
    try {
        const comment = await Comment.findById(request.params.commentId);

        //if comment exists
        if (comment)
        {
            //if creator attempting to update, allow
            if (comment.username === request.body.username)
            {
                const updatedComment = await Comment.findByIdAndUpdate(
                    request.params.commentId,
                    {
                        $set: request.body,
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
router.delete("/:commentId", async (request, response) => { //async bc dont know how long it'll take
    
    try {
        const comment = await Comment.findById(request.params.commentId);

        //if comment exists
        if (comment)
        {
            //if creator attempting to delete, allow
            if (comment.username === request.body.username)
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

//Get All post comments
router.get("/all/:postId", async (request, response) => {

    const postId = request.params.postId;

    const filter = {
        postId
    }
      
    try {
        //returns comments sorted by big -> small rep, if same rep than most recent -> oldest
        const comments = await Comment.find(filter).sort({reputation: "descending", updatedAt: "descending" }); 
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
        response.status(200).json(comment);
    } catch (error) {
        response.status(500).json(error);
    }
});



module.exports = router;