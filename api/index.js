const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/Auth")

dotenv.config();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
})
    .then(console.log("Connected to MongoDB"))
    .catch((error)=>console.log(error));

app.use("/api/auth", authRoute);

app.listen("5000", () => {
    console.log("Backend running.");
});