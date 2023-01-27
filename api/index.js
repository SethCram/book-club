const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/Auth");
const userRoute = require("./routes/Users");
const postRoute = require("./routes/Posts");
const categoryRoute = require("./routes/Categories");
const multer = require("multer");

dotenv.config();
app.use(express.json());

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

//connect routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.listen("5000", () => {
    console.log("Backend running.");
});