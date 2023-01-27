const router = require("express").Router(); //can handle post, put (update), get, delete
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Post = require("../models/Post");

//Create Post
router.post("/", async (request, response) => { //async bc dont know how long it'll take
    const newPost = new Post(request.body);
    try {
        const savedPost = await newPost.save(); // save new post
        response.status(200).json(savedPost);
    } catch (error) {
        response.status(500).json(error);
    }
}); 

//Update Post
router.put("/:postId", async (request, response) => { //async bc dont know how long it'll take
    try {
        const post = await Post.findById(request.params.postId);

        //if post exists
        if (post)
        {
            //if creator attempting to update, allow
            if (post.username === request.body.username)
            {
                const updatedPost = await Post.findByIdAndUpdate(
                    request.params.postId,
                    {
                        $set: request.body,
                    }, 
                    { new: true }
                );
                response.status(200).json(updatedPost);
            }
            else
            {
                response.status(401).json("You can only update your own post");
            }
        }
        else
        {
            response.status(404).json("No post found");
        }

    } catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
}); 

//Delete Post
router.delete("/:postId", async (request, response) => { //async bc dont know how long it'll take
    
    try {
        const post = await Post.findById(request.params.postId);

        //if post exists
        if (post)
        {
            //if creator attempting to delete, allow
            if (post.username === request.body.username)
            {
                await post.delete();
                response.status(200).json("Post deleted");
            }
            else
            {
                response.status(401).json("You can only delete your own post");
            }
        }
        else
        {
            response.status(404).json("No post found");
        }

    } catch (error) {
        response.status(500).json(error);
    }
}); 

//Get Post
router.get("/:postId", async (request, response) => {
    try {
        const post = await Post.findById(request.params.postId);

        //if post exists
        if (post)
        {
            response.status(200).json(post);
        }
        else
        {
            response.status(404).json("No post found");
        }

    } catch (error) {
        response.status(500).json(error);
    }
});

//Get All Posts
router.get("/:postId", async (request, response) => {
    try {
        const post = await Post.findById(request.params.postId);

        //if post exists
        if (post)
        {
            response.status(200).json(post);
        }
        else
        {
            response.status(404).json("No post found");
        }

    } catch (error) {
        response.status(500).json(error);
    }
});

module.exports = router;