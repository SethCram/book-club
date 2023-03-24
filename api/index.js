const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/Auth");
const userRoute = require("./routes/Users");
const postRoute = require("./routes/Posts");
const categoryRoute = require("./routes/Categories");
const voteRoute = require("./routes/Votes");
const badgeRoute = require("./routes/Badges");
const commentRoute = require("./routes/Comments");
const multer = require("multer");
const path = require("path");
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)



dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images"))); //makes images folder public

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(console.log("Connected to MongoDB"))
    .catch((error)=>console.log(error));

const storage = multer.diskStorage({
    destination: (request, file, callbackFunct) => {
        callbackFunct(null, "images"); //save files to images folder
    },
    filename: (request, file, callbackFunct) => {
        callbackFunct(null, request.body.name); //"hello.jpg"); //save file w/ save file name provided (needa use hardcoded name for postman to work)
    }
});

//file upload and deletion
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (request, response) => {
    //console.log(request.body.upload);

    //await upload.single("file");
    
    try {
        response.status(200).json({
            "url": "http://localhost:5000/images/" + request.file.filename
        });
    } catch (error) {
        response.status(500).json({
            "error": {
                "message": "The image upload failed."
            }
        });
    } finally {
        //console.log(request.file.filename);
    }
});
app.delete("/api/photo/delete", async (request, response) => {

    try {
        //last arg should be filename
        const fileName = request.body.filePath.split("/").pop();

        //delete file from local FS
        await unlinkAsync(path.join(__dirname, "/images/" + fileName));

        response.status(200).json("File has been deleted");
    } catch (error) {
        //console.log(error);
        response.status(500).json(error);
    }
});

//connect routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/votes", voteRoute);
app.use("/api/badges", badgeRoute);
app.use("/api/comments", commentRoute);

app.listen("5000", () => {
    console.log("Backend running.");
});