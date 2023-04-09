const router = require("express").Router(); //can handle post, put (update), get, delete
const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

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

//Login
router.post("/login", async (request, response) => {
    let user = true;
    let validated = true;
    
    try {
        user = await User.findOne({ email: request.body.email });
        !user && response.status(400).json("Wrong email or password"); //cant respond with 2 jsons, this triggers catch block

        validated = await bcrypt.compare(request.body.password, user.password); //compare passed in and pass + stored pass
        !validated && response.status(400).json("Wrong email or password");

        //Generate an access token (could include if user is admin)
        const accessToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY); 

        const { password, email, ...publicUser } = user._doc; //rm password from response

        publicUser["jwt"] = accessToken;

        response.status(200).json(publicUser);
    }
    catch (error) {
        console.log(error);
        if(user && validated) response.status(500).json(error); //to avoid catching wrong username/password
    }
});

module.exports = router;