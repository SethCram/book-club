const dotenv = require("dotenv");
const mongoose = require('mongoose');
//models
const Post = require('./models/Post');
const Category = require('./models/Category');
const User = require('./models/User');

//load env file contents
dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(console.log("Connected to MongoDB"))
    .catch((error) => console.log(error));
    
const seedPosts = [
    {
        title: "Interesting Title1",
        description: "Establish a routine and stick to it - set regular work hours and take regular breaks to maintain a sense of structure and balance in your day. Create a dedicated workspace - set up a designated area in your home that is solely for work to help separate work from leisure. Take regular breaks - stepping away from your work for short breaks can help you stay focused and refreshed throughout the day. Prioritize and plan your tasks - make a to-do list and prioritize your tasks to help you stay on track and focused on what needs to be done. Stay connected - working from home can be isolating, so make sure to stay connected with your colleagues and friends through virtual communication channels such as video conferencing, instant messaging and email.",
        username: "paul1",
    },
    {
        title: "Interesting Title2",
        description: "Establish a routine and stick to it - set regular work hours and take regular breaks to maintain a sense of structure and balance in your day. Create a dedicated workspace - set up a designated area in your home that is solely for work to help separate work from leisure. Take regular breaks - stepping away from your work for short breaks can help you stay focused and refreshed throughout the day. Prioritize and plan your tasks - make a to-do list and prioritize your tasks to help you stay on track and focused on what needs to be done. Stay connected - working from home can be isolating, so make sure to stay connected with your colleagues and friends through virtual communication channels such as video conferencing, instant messaging and email.",
        username: "paul2",
    },
];

const seedDB = async () => {
    await Post.insertMany(seedPosts);
};

seedDB().then(() => {
    mongoose.connection.close();
});

