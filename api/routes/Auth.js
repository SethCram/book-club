const router = require("express").Router(); //can handle post, put (update), get, delete
const User = require("../models/User");
const bcrypt = require('bcrypt');

//Register
router.post("/register", async (request, response) => { //async bc dont know how long it'll take
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(request.body.password, salt);
        const newUser = new User({
            username: request.body.username,
            email: request.body.email,
            password: hashedPassword
        });
        
        const user = await newUser.save(); //save new user up in DB
        response.status(200).json(user);
    }
    catch (error) {
        response.status(500).json(error);
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

        const { password, email, ...publicUser } = user._doc; //rm password from response
        response.status(200).json(publicUser);
    }
    catch (error) {
        //console.log(error);
        if(user && validated) response.status(500).json(error); //to avoid catching wrong username/password
    }
});

module.exports = router;