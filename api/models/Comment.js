const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
    {
        username: {
            type: String, 
            required: true
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
        },
        postId: {
            type: mongoose.ObjectId,
            required: true,
        },
        replyId: {
            type: mongoose.ObjectId,
        },
        description: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);