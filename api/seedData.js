const { faker } = require('@faker-js/faker');
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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

const fakeCategoryName = 'Fake';

const createFakeTitle = () => {
    return faker.commerce.productAdjective() + " " + faker.animal.type();
};

const createFakePosts = (numOf, authorsUsernames, categories) => {
    let posts = [];

    for (let i = 0; i < numOf; i++) {
        posts.push({
            title: faker.helpers.unique(createFakeTitle), 
            description: faker.commerce.productDescription() + "/n" + faker.lorem.paragraphs(3, '<br/>\n'),
            username: faker.helpers.arrayElement(authorsUsernames),
            photo: faker.image.animals(),
            categories: { name: faker.helpers.arrayElements(categories) }
        });

        //ensure each fake post tagged w/ Fake
        posts[i].categories.push({name : fakeCategoryName});
    }

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

const createFakeCategories = (numOf) => {
    let cats = [];

    for (let i = 0; i < numOf; i++) {
        cats.push({
            name: faker.helpers.unique(faker.random.word) 
        });
    }

    return cats;
};

const seedDB = async (numOfPosts, numOfUsers, numOfCats) => {

    //create new cats and get their names
    const newCats = createFakeCategories(
        numOf = numOfCats
    );
    let newCatNames = newCats.map(newCat => newCat.name);

    //create new users and get their usernames
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.DEV_PASSWORD, salt);
    const newUsers = createFakeUsers(
        numOf = numOfUsers, password = hashedPassword 
    );
    let newUsernames = [];
    for (let i = 0; i < newUsers.length; i++) {
        newUsernames.push(newUsers[i].username);
    }

    //create new posts according to created users and cats
    const newPosts = createFakePosts(
        numOf = numOfPosts,
        authorsUsernames = newUsernames,
        categories = newCatNames
    );

    //add fake category to posting bc mandatory for each new post
    newCatNames.push(fakeCategoryName); 
    
    //if cant find fake category, add it for creation 
    //if (!Category.find({ name: fakeCategoryName }))
    //{
    //    newCats.push({ name: fakeCategoryName });
    //}

    //insert new posts, users, and cats to DB
    await Post.insertMany(newPosts).then(console.log(`${numOfPosts} posts inserted.`));
    await User.insertMany(newUsers).then(console.log(`${numOfUsers} users inserted.`));
    await Category.insertMany(newCats).then(console.log(`${newCats.length} categories inserted.`));
};

const removeFakeData = async () => {

    //get all posts marked as fake
    const fakePosts = await Post.find({
        'categories.name': fakeCategoryName
    });
    let fakeUsernames = fakePosts.map(fakePost => fakePost.username); //can contain duplicates
    let fakeCategoryNamesUnflattened = fakePosts.map(
        fakePost => fakePost.categories.map(
            fakeCategory => fakeCategory.name
        )); //can contain duplicates
    const fakeCategoryNames = fakeCategoryNamesUnflattened.flat(Infinity);
    
    console.log(fakePosts);
    console.log(fakeUsernames);
    console.log(fakeCategoryNames);

    await User.deleteMany({
        username: {
            $in: fakeUsernames
        }
    }).then(console.log("Deleted all users with fake usernames."));

    await Category.deleteMany({
        name: {
            $in: fakeCategoryNames
        }
    }).then(console.log("Deleted all categories linked to fake category names."));

    await Post.deleteMany({
        'categories.name': fakeCategoryName
    }).then(console.log("Deleted all posts with a fake category."));
};

const closeConnection = () => {
    console.log("Connection closed.");
    mongoose.connection.close();
}

try {
    switch(process.argv[2]){
        case '-i':
            console.log("Inserting fake data.");

            //defaults to 1 post created by 1 user with only 'Fake' cat
            let numOfPosts = 1, numOfUsers = 1, numOfCats = 0;

            //set amt of data to create based on cmd line args
            if (
                process.argv[3] && process.argv[3] === "-p" &&
                process.argv[4] && !isNaN(process.argv[4]) //if nxt arg is digit
            ) {
                numOfPosts = process.argv[4];
            };
            if (
                process.argv[5] && process.argv[5] === "-u" &&
                process.argv[6] && !isNaN(process.argv[6]) //if nxt arg is digit
            ) {
                numOfUsers = process.argv[6];
            };
            if (
                process.argv[7] && process.argv[7] === "-c" &&
                process.argv[8] && !isNaN(process.argv[8]) //if nxt arg is digit
            ) {
                numOfCats = process.argv[8];
            };

            seedDB(numOfPosts, numOfUsers, numOfCats).then(closeConnection);
            break;
        
        case '-d':
            console.log("Deleting all fake data.");
            removeFakeData().then(closeConnection);
            break;
        
        default:
            console.log("Please pass a viable option to the script (-i or -d).");
            closeConnection();
            break;
    }
} catch (error) {
    console.log(error);
    closeConnection(); //close just incase not closed before (what if already closed?)
} 

