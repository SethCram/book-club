const router = require("express").Router(); //can handle post, put (update), get, delete
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
        //console.log(error);
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
router.get("/", async (request, response) => { 
    
    //query-able via username or category
    const username = request.query.username; //query = anything after ?        
    const categoryName = request.query.category;  
    const page = parseInt(request.query.page);
    const PAGE_SIZE = 10;

    try {    

        let filter;

        //if username queried, filter by all posts by that user
        if (username) {
            filter = { username: username };
        }
        //if category queried, filter by all posts marked as that category
        else if(categoryName)
        {
            filter = {
                "categories.name": {
                    $in: [categoryName] //could theoretically query via mult cats
                }
            };
        }
        //if no query or unspecified query case, filter by all posts
        else
        {
            filter = {};
        }

        //find posts by filter
        const posts = await Post.find(filter)
            .limit(PAGE_SIZE)
            .skip(PAGE_SIZE * page);

        //count documents by filter
        const totalPostPages = Math.ceil( await Post.countDocuments(filter) / PAGE_SIZE);

        response.status(200).json({
            totalPages: totalPostPages,
            posts
        });

    } catch (error) {
        response.status(500).json(error);
    }
});

//Sum All Posts by a param
router.get("/sum/sum", async (request, response) => { 
    
    //query-able via summation
    const username = request.query.username;
    const sumBy = request.query.sumBy;
    const user_cats = parseInt(request.query.count);

    try {

        //if (sumBy && username) {
        //    if (sumBy === "category") {
                //find posts by filter + aggregate
        const posts = await Post.aggregate([
            { "$match" : { username: username }},
            { $unwind: "$categories" },
            { $sortByCount: "$categories.name"}, //sorts in descending order
            //{ $rename: { "_id": "name" }}
        ])
            .limit(user_cats);
        //    }
        //}

        //console.log(posts);
        
        response.status(200).json({
            categoryCount: posts
        });

    } catch (error) {
        response.status(500).json(error);
    }
});

module.exports = router;