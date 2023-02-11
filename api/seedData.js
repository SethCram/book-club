const { faker } = require('@faker-js/faker');
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

const createFakeTitle = () => {
    return faker.commerce.productAdjective() + " " + faker.animal.type();
};

const createFakePosts = (numOfPosts, authorsUsernames, categories, postPicFileName) => {
    let posts = [];

    console.log(numOfPosts);

    for (let i = 0; i < numOfPosts; i++) {
        posts.push({
            title: faker.helpers.unique(createFakeTitle), 
            description: faker.commerce.productDescription(),
            username: faker.helpers.arrayElement(authorsUsernames),
            photo: faker.image.animals(),
            categories: faker.helpers.arrayElements(categories)
        });
    }

    console.log(posts);

    return posts;
};

const createFakeUsers = (numOf, password) => {
    let users = [];

    for (let i = 0; i < numOf; i++) {
        users.push({
            username: faker.helpers.unique( faker.internet.userName ),
            email: faker.helpers.unique( faker.internet.email ),
            password: password,
            profilePicture: faker.internet.avatar(),
            bio: faker.company.catchPhrase(),
            instagramLink: faker.internet.url(),
            twitterLink: faker.internet.url(),
            facebookLink: faker.internet.url(),
            pinterestLink: faker.internet.url(),
        });
    }

    return users;
};

const seedDB = async () => {
    //await Post.insertMany(seedPosts);
    console.log(createFakePosts(
        numOfPosts = 5,
        authorsUsernames = ['charles', 'pauline'],
        categories = ['Life', 'Art'],
        postPicFileName = ""
    ));

    console.log(createFakeUsers(
        numOf = 5, password = '123456'
    ));
};

const removeFakeData = async () => {
    await Post.deleteMany({ data: seedPosts });
};

const closeConnection = () => {
    console.log("Connection closed.");
    mongoose.connection.close();
}

try {
    switch(process.argv[2]){
        case '-i':
            console.log("Inserting fake data.");
            seedDB().then(closeConnection);
            break;
        
        case '-d':
            console.log("Deleting fake data.");
            removeFakeData().then(closeConnection);
            break;
        
        default:
            console.log("Please pass a viable option to the script.");
            closeConnection();
            break;
    }
} catch (error) {
    console.log(error);
    closeConnection(); //close just incase not closed before (what if already closed?)
} 

