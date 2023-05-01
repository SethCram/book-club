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
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const {URL} = require('url');

//bring in env vars
dotenv.config();
//start express app + accept body as json
app.use(express.json());
//specify images folder as public
app.use("/images", express.static(path.join(__dirname, "/images")));

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

//file upload to environment FILE_STORAGE_URL
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (request, response) => {
    
    try {
        let responseImageURL = new URL(process.env.FILE_STORAGE_URL);
        responseImageURL.pathname = path.join("images", request.file.filename);

        response.status(201).json({ // responses must be structured this way for ckeditor5 custom image uploader
            "url": responseImageURL.href
        });
    } catch (error) {
        response.status(500).json({ // responses must be structured this way for ckeditor5 custom image uploader
            "error": {
                "message": "The image upload failed."
            }
        });
    } finally {
        //console.log(request.file.filename);
    }
});

//local file storage deletion
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