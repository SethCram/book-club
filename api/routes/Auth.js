const router = require("express").Router(); //can handle post, put (update), get, delete
const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { verify } = require("./HelperFunctions");

//Register
router.post("/register", async (request, response) => { //async bc dont know how long it'll take
    
    const username = request.body.username;
    const postedEmail = request.body.email;

    let user = null;

    //Make sure username unique
    try {
        user = await User.findOne({ username });
    } catch (error) {
        response.status(500).json(error);
    }

    if (user) {
        response.status(400).json("Username not unique.");
    }
    //if username unique
    else
    {   
        //make sure email unique
        try {
            user = await User.findOne({ email: postedEmail });
        } catch (error) {
            response.status(500).json(error);
        }

        if (user) {
            response.status(400).json("Can't reuse the same email.");
        }
        //if email unique
        else
        {
            try {
                //hash password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(request.body.password, salt);
                
                const newUser = new User({
                    username: username,
                    email: postedEmail,
                    password: hashedPassword
                });
                
                user = await newUser.save(); //save new user up in DB
        
                //remove password and email from response
                const { password, email, ...publicUser } = user._doc;
        
                response.status(201).json(publicUser);
            }
            catch (error) {
                response.status(500).json(error);
            }
        }
    }
}); 

const generateAccessToken = (user) => {

    let expiresIn;

    if (process.env.ENV === "DEV") {
        expiresIn = "15m";
    }
    else if (process.env.ENV === "PROD") {
        expiresIn = "5s";
    }

    return jwt.sign(
        { _id: user._id, username: user.username, isAdmin: user.isAdmin, reputation: user.reputation },
        process.env.JWT_ACCESS_SECRET_KEY,
        { expiresIn: expiresIn}
    ); 
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        { _id: user._id, username: user.username, isAdmin: user.isAdmin, reputation: user.reputation },
        process.env.JWT_REFRESH_SECRET_KEY
    ); 
}

//adds refresh token to the db user's arr combining old tokens + new token
const addRefreshToken = async (user, oldRefreshTokens, newRefreshToken) => {
    //add to refresh tokens arr for this user
    const updatedRefreshTokens = [...oldRefreshTokens, newRefreshToken];
    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { refreshTokens: updatedRefreshTokens },
        { new: true }
    );

    return updatedUser;
}

//Login
router.post("/login", async (request, response) => {
    let user = true;
    let validated = true;
    
    try {
        user = await User.findOne({ email: request.body.email });
        if (!user)
            return response.status(400).json("Wrong email or password"); //cant respond with 2 jsons, this triggers catch block

        validated = await bcrypt.compare(request.body.password, user.password); //compare passed in and pass + stored pass
        if (!validated)
            return response.status(400).json("Wrong email or password");

        //Generate an access token 
        const accessToken = generateAccessToken(user);

        //gen refresh token
        const refreshToken = generateRefreshToken(user);

        user = await addRefreshToken(user, user.refreshTokens, refreshToken);

        const { password, email, ...publicUser } = user._doc; //rm password + email from response

        publicUser["refreshToken"] = refreshToken;
        publicUser["accessToken"] = accessToken;

        response.status(200).json(publicUser);
    }
    catch (error) {
        console.log(error);
        response.status(500).json(error); //to avoid catching wrong username/password
    }
});

//refresh jwt
router.post("/refresh", async (request, response) => {
    //take refresh token from user
    const refreshToken = request.body.token;

    //send error if no token or invalid 
    if (!refreshToken)
        return response.status(401).json("You aren't authenticated.");

    jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET_KEY,
        async (error, payload) => {
            if (error) {
                console.log(error);
                return response.status(403).json("Token isn't valid.");
            }  
            else {

                let user;

                try {
                    user = await User.findById(
                        payload._id
                    );
                } catch (error) {
                    return response.status(404).json("Couldn't find user by their token id.");
                }

                const refreshTokens = user.refreshTokens;

                if (!refreshTokens.includes(refreshToken)) {
                    return response.status(403).json("Refresh token is not valid.");
                }

                //rm passed in refreshToken
                const otherRefreshTokens = refreshTokens.filter(token => token !== refreshToken);

                //Generate an access token 
                const newAccessToken = generateAccessToken(user);

                //gen refresh token
                const newRefreshToken = generateRefreshToken(user);

                //post rm'd passed in refreshToken and new refresh token
                user = await addRefreshToken(user, otherRefreshTokens, newRefreshToken);

                response.status(201).json({
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken
                })
            }
    });
    
    //create new access token, refresh token, send to user
})

//logout user
router.put("/logout", verify, async (request, response) => {
    
    const refreshToken = request.body.token;

    let user;

    try {
        user = await User.findById(
            request.user._id
        );
    } catch (error) {
        return response.status(404).json("Couldn't find user by their token id.");
    }

    const refreshTokens = user.refreshTokens;

    if (!refreshTokens.includes(refreshToken)) {
        return response.status(403).json("Refresh token is not valid.");
    }

    //rm passed in refreshToken
    const otherRefreshTokens = refreshTokens.filter(token => token !== refreshToken);
    
    const updatedUser = await User.findByIdAndUpdate(
        request.user._id,
        { refreshTokens: otherRefreshTokens },
        { new: true }
    );

    if (updatedUser) {
        if (updatedUser.refreshTokens.some(token => token === refreshToken)) {
            return response.status(500).json("Refresh token wasn't removed");
        }
    }

    const { password, email, ...publicUser } = updatedUser._doc;

    response.status(200).json(publicUser);

});

module.exports = router;