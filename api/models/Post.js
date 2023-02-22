const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true //not entirely necessary
        },
        description: {
            type: String,
            required: true
        },
        photo: {
            type: String,
            required: false
        },
        username: {
            type: String, 
            required: true
        },
        categories: {
            type: Array,
            required: false
        },
        reputation: {
            type: Number,
            default: 0,
            validate : {
                validator : Number.isInteger,
                message   : '{VALUE} is not an integer value'
            }
        },
        badgeName: {
            type: String
        }
    },
    { timestamps: true } //for updated and created at timestamps
);

module.exports = mongoose.model("Post", PostSchema);