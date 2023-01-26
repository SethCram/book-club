const Users = require("./Users");
const router = require("express").Router(); //can handle post, put (update), get, delete
const user = require("../models/User");
const bcrypt = require('bcrypt');

//Register
router.post("/register", async (request, response) => { //async bc dont know how long it'll take
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(request.body.password, salt);
        const newUser = new Users({
            username: request.body.username,
            email: request.body.email,
            password: hashedPassword
        })
        
        const user = await newUser.save(); //save new user up in DB
        response.status(200).json(user);
    }
    catch (error) {
        response.status(500).json(error);
    }
}); 

//Login

module.exports = router