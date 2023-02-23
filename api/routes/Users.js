const router = require("express").Router(); //can handle post, put (update), get, delete
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Post = require("../models/Post");
const Vote = require("../models/Vote");

//Update user
router.put("/:userId", async (request, response) => { //async bc dont know how long it'll take
    
    //can be safer through using JWT = Jason Web Token
    if(request.body.userId === request.params.userId) //compare url id to body id
    {
        //if password passed in, hash it
        if (request.body.password) {
            const salt = await bcrypt.genSalt(10);
            request.body.password = await bcrypt.hash(request.body.password, salt); //change requested password to hashed version
        }

        try {

            const user = await User.findById(request.params.userId);

            if (user )
            {
                //if changing username
                if (user.username != request.body?.username) {

                    //update posts and their usernames
                    try {
                        await Post.updateMany(
                            { username: user.username },
                            { username: request.body.username}
                        );
                    } catch (error) {
                        response.status(500).json("Failed to update their posts usernames, so user not updated.");
                    }
                }

                //if can find user, update it
                const updatedUser = await User.findByIdAndUpdate(
                    request.params.userId,
                    { //could use either userId since they're the same
                        $set: request.body //sets entire req body
                    },
                    { new: true } //want updated user
                ); 

                response.status(200).json(updatedUser);
            }
            else
            {
                response.status(404).json("User not found");
            }

        }
        catch (error) {
            response.status(500).json(error);
        }
    }
    else
    {
        response.status(401).json("You can only update your own account");
    }
}); 

//Delete User and their posts
router.delete("/:userId", async (request, response) => { //async bc dont know how long it'll take
    
    //can be safer through using JWT = Jason Web Token
    // compare url id to request body id to see if correct user altering
    if(request.body.userId === request.params.userId)
    {
        //if can find user, delete it
        const user = await User.findById(request.params.userId);
        if (user)
        {
            try {
                //delete all posts posted by someone with same username
                //await Post.deleteMany({ username: user.username });

                //delete all their votes
                await Vote.deleteMany({ username: request.body.username });
                
                await User.findByIdAndDelete(request.params.userId); 
                response.status(200).json("User and their votes have been deleted");
            }
            catch (error) {
                response.status(500).json(error);
            }
        }
        //if cant find user, tell them
        else
        {
            response.status(404).json("No user found");
        }
    }
    else
    {
        response.status(401).json("You can only delete your own account");
    }
}); 

//Get User via id 
router.get("/id/:userId", async (request, response) => {
    
    //if can find user, return it (besides pass)
    try {
        const user = await User.findById(request.params.userId);
        if (user)
        {
            const { password, ...publicUser} = user._doc; //dont show password 
            response.status(200).json(publicUser);
        }
        else
        {
            response.status(404).json("No user found");
        }
    }
    catch (error) {
        //console.log(error);
        response.status(500).json(error);
    }
});

//Get User via username
router.get("/username/:username", async (request, response) => {
    //if can find user, return it (besides pass)
    try {
        const user = await User.findOne({username: request.params.username});
        if (user)
        {
            const { password, email, ...publicUser} = user._doc; //dont show password 
            response.status(200).json(publicUser);
        }
        else
        {
            response.status(404).json("No user found");
        }
    }
    catch (error) {
        //console.log(error);
        response.status(500).json(error);
    }
});

module.exports = router;