const mongoose = require("mongoose");

const BadgeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        score: {
            type: Number,
            required: true,
            unique: true,
            validate : {
                validator : Number.isInteger,
                message   : '{VALUE} is not an integer value'
            }
        }
    },
    { timestamps: true } //for updated and created at timestamps
);

module.exports = mongoose.model("Badge", BadgeSchema);