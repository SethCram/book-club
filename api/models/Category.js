const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        }
    },
    { timestamps: true } //for updated and created at timestamps (not needed here)
);

module.exports = mongoose.model("Category", CategorySchema);