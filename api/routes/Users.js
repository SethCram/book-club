const router = require("express").Router(); //can handle post, put (update), get, delete
const User = require("../models/User");
const bcrypt = require("bcrypt");
const {verify} = require("./HelperFunctions");

//Update user
router.put("/:userId", verify, async (request, response) => { //async bc dont know how long it'll take

    //console.log(request.body);

    //compare verified userId to params userID
    if (request.user._id === request.params.userId &&
        request.user._id === request.body.userId) 
    {
        //if password passed in, hash it
        //if (request.body.password) {
        //    const salt = await bcrypt.genSalt(10);
        //    request.body.password = await bcrypt.hash(request.body.password, salt); //change requested password to hashed version
        //}

        //if password sent in
        if (request.body.password) {
            
            //don't let user update password, isAdmin, badgeName, rep, or username
            const { password,
                isAdmin,
                badgeName,
                reputation,
                username,
                ...updatedParams } = request.body;

            //find the user
            const user = await User.findById(request.params.userId);

            //if user found
            if (user) {
                //if password is correct
                if (await bcrypt.compare(password, user.password)) {
                    
                    /*
                    //if changing username
                    if (user.username != request.body?.username) {

                        const filterByUsername = { username: user.username };
                        const updateUsername = { username: request.body.username };

                        //update posts authored usernames
                        try {
                            await Post.updateMany(
                                filterByUsername,
                                updateUsername
                            );
                        } catch (error) {
                            response.status(500).json("Failed to update their posts usernames, so user not updated.");
                        }

                        //update comments usernames
                        try {
                            //update comments authored usernames
                            await Comment.updateMany(
                                filterByUsername,
                                updateUsername
                            )

                            //update their root comments' replies if held as a reply

                            //update replyUsername of comments replying to this one
                        } catch (error) {
                            response.status(500).json("Failed to update their comments usernames, so user not updated.");
                        }

                        //update vote authored username
                        try {
                            await Vote.updateMany(
                                filterByUsername,
                                updateUsername
                            )
                        } catch (error) {
                            response.status(500).json("Failed to update their comments usernames, so user not updated.");
                        }
                    }
                    */

                    try {
                        //if can find user, update it
                        const updatedUser = await User.findByIdAndUpdate(
                            request.params.userId,
                            {
                                $set: updatedParams
                            },
                            { new: true } //want updated user
                        );

                        const { password, email, ...publicUser } = updatedUser._doc;

                        response.status(200).json(publicUser);
                    } catch (error) {
                        response.status(500).json(error);
                    }
                }
                else {
                    response.status(401).json("Password incorrect");
                }
            }
            else {
                response.status(404).json("User not found");
            }

            
        }
        else {
            response.status(400).json("Password is required to authenticate user update.");
        }
    }
    else {
        response.status(401).json("You can only update your own account");
    }
}); 

//Delete User 
router.delete("/:userId", verify, async (request, response) => { //async bc dont know how long it'll take
    
    //compare url id to request body id to see if correct user altering
    // or if verified admin
    if((request.user._id === request.params.userId &&
        request.user._id === request.body.userId)
        ||
        request.user.isAdmin)
    {
        //if can find user, delete it
        const user = await User.findById(request.params.userId);
        if (user)
        {
            try {
                //delete all posts posted by someone with same username
                //await Post.deleteMany({ username: user.username });

                //delete all their votes
                //await Vote.deleteMany({ username: request.body.username });
                
                await User.findByIdAndDelete(request.params.userId); 
                response.status(200).json("User has been deleted");
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