const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
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
        }
    },
    { timestamps: true } //for updated and created at timestamps
);

module.exports = mongoose.model("Post", PostSchema);