const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/Auth");
const userRoute = require("./routes/Users");
const postRoute = require("./routes/Posts");
const categoryRoute = require("./routes/Categories");
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

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (request, response) => {
    response.status(200).json("File has been uploaded");
});

app.delete("/api/photo/delete", async (request, response) => {
    //last arg should be filename
    const fileName = request.body.filePath.split("/").pop();
    try {
        //delete file from local FS
        await unlinkAsync(path.join(__dirname, "/images/" + fileName));

        response.status(200).json("File has been deleted");
    } catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
});

//connect routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.listen("5000", () => {
    console.log("Backend running.");
});