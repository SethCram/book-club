const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        profilePicture: {
            type: String, //shouldnt be str??
            default: ""
        },
    },
    { timestamps: true } //for updated and created at timestamps
);

module.exports = mongoose.model("User", UserSchema);