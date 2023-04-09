const router = require("express").Router(); //can handle post, put (update), get, delete
const Post = require("../models/Post");
const { updateUserRep } = require("./HelperFunctions");

//Create Post
router.post("/", async (request, response) => { //async bc dont know how long it'll take
    try {     
        
        const newPost = new Post(request.body);
        const username = request.body.username;
    
        let updatedAuthor;

        //check if number of posts by user is gonna fall on a threshold value
        if ((((await Post.countDocuments({ username })) + 1) % 5) === 0) {
            updatedAuthor = await updateUserRep(
                5,
                username
            );
        }

        const savedPost = await newPost.save(); // save new post

        const responseObj = {
            post: savedPost
        }

        if (updatedAuthor) {
            responseObj["updatedUser"] = updatedAuthor;
        }

        response.status(201).json(responseObj);
    } catch (error) {
        console.log(error);
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
    let page = parseInt(request.query.page);
    const searchContents = request.query.searchContents;

    const PAGE_SIZE = 10;
    let filter = {}; //if no query or unspecified query case, filter by all posts
    let posts;
    let totalPostPages;

    //default page to 0 if none passed in
    if (!page) {
        page = 0;
    }

    const skipPosts = PAGE_SIZE * page;

    try {

        //if search bar request
        if (searchContents) {
            filter = {
                $search: {
                    index: "searchPosts",
                    text: {
                        query: searchContents,
                        path: {
                            wildcard: "*"
                        },
                        fuzzy: {} /* use fuzzy searching defaults */
                    }
                }
            };

            //find posts by filter
            posts = await Post.aggregate([filter])
                .skip(skipPosts)
                .limit(PAGE_SIZE);
            
            //count documents by filter
            totalPostPages = Math.ceil((await Post.aggregate([filter])).length / PAGE_SIZE);
        }
        //if keyword request
        else {
            //if username queried, filter by all posts by that user
            if (username) {
                filter["username"] = username;
            }
            
            //if category queried, filter by all posts marked as that category
            if (categoryName) {

                filter["categories.name"] = {
                    $in: [categoryName] //could theoretically query via mult cats
                };
                
            }

            //find posts by filter
            posts = await Post.find(filter)
                .limit(PAGE_SIZE)
                .sort({ reputation: "descending", updatedAt: "descending" })
                .skip(skipPosts);
            
            //count documents by filter
            totalPostPages = Math.ceil(await Post.countDocuments(filter) / PAGE_SIZE);
        }

        response.status(200).json({
            totalPages: totalPostPages,
            posts
        });

    } catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
});

//get possible autocomplete terms
router.get("/autocomplete/:searchTerm", async (request, response) => {

    const MAX_AUTOCOMPLETE_TERMS = 10;

    let pipeline = [
        {
            $search: {
                index: "autoCompletePosts",
                "autocomplete": {
                    "query": request.params.searchTerm,
                    "path": "title",
                    "tokenOrder": "sequential"
                }
            }
        }
    ];

    try {
        const postTitles = await Post.aggregate(pipeline)
            .limit(MAX_AUTOCOMPLETE_TERMS)
            .project({ "title": 1 });
        
        response.status(200).json({
            posts: postTitles
        });
    } catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
});

//Sum All Posts by a param
router.get("/sum/sum", async (request, response) => { 
    
    //query-able via summation
    const username = request.query.username;
    const sumBy = request.query.sumBy;

    try {

        let pipeline = [
            { $unwind: "$categories" },
            { $sortByCount: "$categories.name" } //sorts in descending order
        ]

        if (username) {
            pipeline.unshift({ "$match": { username: username } });
        }

        let posts;

        //apply limit if count passed in
        if (request.query.count) {
            const user_cats = parseInt(request.query.count);

            posts = await Post.aggregate(pipeline)
                .limit(user_cats);
        }
        else {
            posts = await Post.aggregate(pipeline);
        }

        //console.log(posts);
        
        response.status(200).json({
            categoriesCount: posts
        });

    } catch (error) {
        response.status(500).json(error);
    }
});

module.exports = router;