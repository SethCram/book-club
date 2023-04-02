const { faker } = require('@faker-js/faker');
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//models
const Post = require('./models/Post');
const Category = require('./models/Category');
const User = require('./models/User');
const Vote = require('./models/Vote');
const Badge = require('./models/Badge');
const Comment = require('./models/Comment');

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

function sortedIndex(array, value) {

    var low = 0,
        high = array.length;

    while (low < high) {
        var mid = (low + high) >>> 1;
        if (array[mid].score <= value) low = mid + 1;
        else high = mid;
    }
    return low;
}

//inclusive random funct on both bounds
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
  
//create a fake reputation with the approp badgeName
const createFakeReputation = (badges) => {
    //generate a random rep
    const rep = getRndInteger(-50, 600);

    let repObject = {
        "reputation": rep
    }

    if (rep <= -1 || rep >= 10) {
        //assign the approp badge name for range
        let badgeIndex = sortedIndex(badges, rep);
        
        if (badgeIndex !== 0) {
            badgeIndex -= 1;
        }

        repObject["badgeName"] = badges[badgeIndex].name;
    }

    return repObject;
}

const createRandomPhotoUrl = (width, height) => {
    
    const listOfFuncts = [
        faker.image.animals,
        faker.image.abstract,
        faker.image.business,
        faker.image.city,
        faker.image.fashion,
        faker.image.food,
        faker.image.image,
        faker.image.nature,
        faker.image.nightlife,
        faker.image.people,
        faker.image.sports,
        faker.image.technics,
        faker.image.transport,
    ]

    return faker.helpers.arrayElement(listOfFuncts)(width, height, true);
}

const createFakePosts = (numOf, authorsUsernames, categories, badges) => {
    
    if (numOf < authorsUsernames.length) {
        throw new Error("There must be atleast one user per post for future deletion purposes.");
    }
    
    let posts = [];

    for (let i = 0; i < numOf; i++) {

        //create dates within the past year
        const creationDate = faker.date.recent(365)

        //create baseline post
        let tmpPost = {
            title: faker.helpers.unique(createFakeTitle), 
            description: faker.commerce.productDescription() + " " + faker.lorem.paragraphs(3),
            photo: createRandomPhotoUrl(1234, 1234),
            categories: [],
            createdAt: creationDate,
            updatedAt: creationDate
        }

        //ensure every author used atleast once in a fake post
        let authorUsername;

        if (i < authorsUsernames.length) {
            authorUsername = authorsUsernames[i];
        }
        else
        {
            authorUsername = faker.helpers.arrayElement(authorsUsernames);
        }

        tmpPost["username"] = authorUsername;

        //add some categories
        faker.helpers.arrayElements(categories.slice(0, 2)).forEach(catName => {
            tmpPost.categories.push({name: catName})
        });

        //ensure each fake post tagged w/ "Fake"
        tmpPost.categories.push({ name: fakeCategoryName });

        //create a fake reputation for the post
        const repObj = createFakeReputation(badges);

        //combine rep obj fields, overwriting + adding to tmp
        posts[i] = { ...repObj, ...tmpPost };
    }

    return posts;
};

const createFakeUser = (password, badges) => {

    let tmpUser = {
        username: faker.helpers.unique(faker.internet.userName),
        email: faker.helpers.unique(faker.internet.email),
        password: password,
        profilePicture: faker.internet.avatar(),
        bio: faker.company.catchPhrase(),
        instagramLink: faker.internet.url(),
        twitterLink: faker.internet.url(),
        facebookLink: faker.internet.url(),
        pinterestLink: faker.internet.url(),
    };

    //create a fake reputation for the user
    const repObj = createFakeReputation(badges);

    //combine rep obj fields, overwriting + adding to tmp
    const user = {...repObj, ...tmpUser}

    return user;
}

const createFakeUsers = (numOf, password, badges) => {
    let users = [];

    for (let i = 0; i < numOf; i++) {
        users.push(createFakeUser(password, badges));
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

//Creates numsOfEachBadge 
// assumes badges r in descending order
//const createFakeVotes = (numsOfEachBadge, posts, badgesDescOrdered, votersPassword) => {
const createFakeVotes = (posts, users) => {
    let votes = [];

    //for each post
    for (let j = 0; j < posts.length; j++) {
        //have each user vote on it
        for (let i = 0; i < users.length; i++) {
            //if they arent the author
            if (posts[j].username !== users[i].username) {
                votes.push({
                    score: faker.helpers.arrayElement([-1,1]),
                    linkedId: posts[j]._id, //check if object id or str and whether it matters
                    username: users[i].username
                });
            }
        }        
    }

    return votes

    /*
    let voteScore;
    let numOfVotesRequired;
    let voters = [];

    //Walk thru badge creation mult times
    for (let k = 0; k < numsOfEachBadge; k++) {

        //walk thru each badge that has a post left
        for (let i = 0; i < badgesDescOrdered.length && i < posts.length; i++) {

            //number of votes required to achieve this badge
            numOfVotesRequired = Math.abs(badgesDescOrdered[i].score);

            //create enough voters and votes for 1 post to reach a badge
            for (let j = 0; j < numOfVotesRequired; j++) {

                //if first iteration, should be highest badge score
                // so create a user for every vote 
                // as long as already haven't previously 
                // (reuse these voters in subsequent votes)
                if (i == 0 && voters.length < badgesDescOrdered[i].score) {
                    voters.push(createFakeUser(votersPassword));
                }

                //if trying to get a negative scored badge
                if (badgesDescOrdered[i].score < 0) {
                    voteScore = -1;
                }
                //trying to get positively scored badge
                else
                {
                    voteScore = 1;
                }

                votes.push({
                    score: voteScore,
                    linkedId: posts[i+k*i]._id, //check if object id or str and whether it matters
                    username: voters[j].username
                });
            }
        }
    }
    return [votes, voters]
    */
};

const createFakeComment = (postId, username, badges, minDate, replyId = undefined, replyUsername = "") => {
    
    const creationDate = faker.date.between(
        minDate,
        new Date().toLocaleDateString().replace("/", ":")
    );

    let tmpComment = {
        postId,
        username,
        description: faker.lorem.lines(), /* could use sentences instead */
        createdAt: creationDate,
        updatedAt: creationDate,
    };

    if (replyId) {
        tmpComment["replyId"] = replyId;
    }

    if (replyUsername) {
        tmpComment["replyUsername"] = replyUsername;
    }

    //create a fake reputation
    const repObj = createFakeReputation(badges);

    //combine rep obj fields, overwriting + adding to tmp
    const comment = { ...repObj, ...tmpComment };

    return comment;
};

//replyRate must be a number from 0-1
const createFakeComments = (posts, users, badges) => {
    let comments = [];

    //for each post
    for (let j = 0; j < posts.length; j++) {
        //have each user comment on it
        for (let i = 0; i < users.length; i++) {

            const comment = createFakeComment(
                posts[j]._id,
                users[i].username,
                badges,
                posts[j].createdAt
            );
            comments.push( comment );
            
        }    
    }

    return comments
}

//replyRate must be a number from 0-1
const createFakeReplyComments = (posts, users, commentsToReplyTo, badges, replyRate = 0.5) => {

    let replyComments = [];

    //for each post
    for (let j = 0; j < posts.length; j++) {
        //have each user comment on it
        for (let i = 0; i < users.length; i++) {
            //reply to a comment replyRate % of the time
            const rando = Math.random();
            if ( rando < replyRate) {

                //pick random comment to reply to
                const randomCommentIndex = getRndInteger(0, commentsToReplyTo.length - 1);
                const commentToReplyTo = commentsToReplyTo[randomCommentIndex];

                //create a reply to the comment
                const reply = createFakeComment(
                    commentToReplyTo.postId,
                    users[i].username,
                    badges,
                    commentToReplyTo.createdAt,
                    commentToReplyTo._id,
                    commentToReplyTo.username
                );

                //add reply to list of comments
                replyComments.push(reply);
            }
        }    
    }

    return replyComments;
}

//replyRate must be a number from 0-1
const linkReplyCommentsToRootComments = (rootComments, commentsToReplyTo, newlyPostedReplyComments) => {

    //for each newly posted reply comment
    for (let j = 0; j < newlyPostedReplyComments.length; j++) {

        const replyComment = newlyPostedReplyComments[j];

        //find comment being replied to
        let replyCommentIndex = commentsToReplyTo.findIndex(comment => {
            return comment._id.equals(replyComment.replyId)
        });
        const commentRepliedTo = commentsToReplyTo[replyCommentIndex];

        //find the root comment being replied to
        if (commentRepliedTo.replyId) {
            //find replied to root comment index
            replyCommentIndex = rootComments.findIndex(comment => {
                return comment._id.equals(commentRepliedTo.replyId)
            });
        }
        //otherwise, already root comment
        
        //console.log(rootComments[replyCommentIndex]);

        if (replyCommentIndex !== -1) {
            //add reply to root comment
            rootComments[replyCommentIndex].replies.push(replyComment);
        }
        else {
            throw new Error("Couldn't find a comment's root replied to comment.");
        }
    }

    return rootComments;
}

const seedDB = async (numOfPosts, numOfUsers, numOfCats) => {

    //find all badges in DB
    const badges = await Badge.find().sort({ score: "ascending" });

    //create new cats and get their names
    const newCats = createFakeCategories(
        numOf = numOfCats
    );
    let newCatNames = newCats.map(newCat => newCat.name);

    //create new users and get their usernames
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.DEV_PASSWORD, salt);
    const newUsers = createFakeUsers(
        numOf = numOfUsers, password = hashedPassword, badges
    );
    let newUsernames = [];
    for (let i = 0; i < newUsers.length; i++) {
        newUsernames.push(newUsers[i].username);
    }

    //create new posts according to created users and cats
    const newPosts = createFakePosts(
        numOf = numOfPosts,
        authorsUsernames = newUsernames,
        categories = newCatNames,
        badges,
    );

    //insert new posts
    const insertedPosts = await Post.insertMany(newPosts);
    console.log(`${insertedPosts.length} posts inserted.`)

    //create new fake votes
    const newVotes = createFakeVotes(insertedPosts, newUsers);

    //INSERT ROOT COMMENTS
    const newRootComments = createFakeComments(insertedPosts, newUsers, badges);
    const insertedRootComments = await Comment.insertMany(newRootComments);
    console.log(`   ${insertedRootComments.length} root comments inserted.`);

    //INSERT ROOT REPLY COMMENTS
    const replyComments = createFakeReplyComments(
        insertedPosts, newUsers,
        insertedRootComments, badges, 1
    );

    //POST ROOT REPLY COMMENTS
    const insertedRootReplyComments = await Comment.insertMany(replyComments );
    console.log(`   ${insertedRootReplyComments.length} root reply comments inserted.`);
    
    //LINK ROOT REPLY COMMENTS TO ROOT COMMENTS
    const updatedRootComments = linkReplyCommentsToRootComments(
        insertedRootComments,
        insertedRootComments,
        insertedRootReplyComments
    )

    //INSERT REPLIES TO REPLY COMMENTS
    const replyReplyComments = createFakeReplyComments(
        insertedPosts, newUsers,
        insertedRootReplyComments, badges, 1
    );

    //POST REPLIES TO REPLY COMMENTS
    const insertedReplyReplyComments = await Comment.insertMany(replyReplyComments );
    console.log(`   ${insertedReplyReplyComments.length} replies to reply comments inserted.`);

    //LINK REPLIES TO REPLY COMMENTS TO ROOT COMMENTS
    const updatedRootCommentsV2 = linkReplyCommentsToRootComments(
        updatedRootComments,
        insertedRootReplyComments,
        insertedReplyReplyComments
    )

    //UPDATE ROOT COMMENT REPLIES
    const bulk = [];
    updatedRootCommentsV2.forEach((item) => {
        bulk.push(
            {
                updateOne: {
                    "filter": {_id: item._id},
                    "update": { $set: {replies: item.replies } }
                }
            }
        )
    })
    const bulkWriteResponse = await Comment.bulkWrite(bulk);
    console.log(`   Updated ${bulkWriteResponse.result.nModified}/${updatedRootComments.length} root comment replies.`);

    console.log(`${updatedRootComments.length+insertedRootReplyComments.length+insertedReplyReplyComments.length} comments inserted in total.`);

    //INSERT USERS, CATS, VOTES
    const insertedUsers = await User.insertMany(newUsers);
    console.log(`${insertedUsers.length} users inserted.`);
    const insertedCats = await Category.insertMany(newCats);
    console.log(`${insertedCats.length} categories inserted.`);
    const insertedVotes = await Vote.insertMany(newVotes);
    console.log(`${insertedVotes.length} votes inserted.`);

    //add fake category to posting bc mandatory for each new post 
    // (unnecessary but may be useful in the future)
    //newCatNames.push(fakeCategoryName); 
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

    const userFilter = {
        username: {
            $in: fakeUsernames
        }
    };

    //delete all posts marked as "Fake"
    const deletedPostsCount = await Post.deleteMany({
        'categories.name': fakeCategoryName
    });
    console.log(`Deleted ${deletedPostsCount.deletedCount} posts with a fake category.`);

    //delete all users w/ a fake username
    const deletedUsersCount = await User.deleteMany(userFilter);
    console.log(`Deleted ${deletedUsersCount.deletedCount} users with fake usernames.`);

    //delete all categories connected to a fake category
    const deletedCatsCount = await Category.deleteMany({
        name: {
            $in: fakeCategoryNames
        }
    });
    console.log(`Deleted ${deletedCatsCount.deletedCount} categories linked to fake category names.`);

    const deletedVotesCount = await Vote.deleteMany(userFilter);
    console.log(`Deleted ${deletedVotesCount.deletedCount} votes with fake usernames.`);

    const deletedCommentsCount = await Comment.deleteMany(userFilter);
    console.log(`Deleted ${deletedCommentsCount.deletedCount} comments with fake usernames.`);
};

const closeConnection = () => {
    mongoose.connection.close()
        .then(console.log("Connection closed.")); 
    
    //mongoose.disconnect()
}

const main = async (process) => {

    var argv = require('minimist-lite')(process.argv.slice(2));
    //console.log(argv);
    
    try {
        
        //defaults to 5 posts created by 1 user linked to 'Fake' cat and 0 badges
        let numOfPosts = 5, numOfUsers = 1, numOfCats = 0;
    
        //if inserting data
        if (argv.i) {

            console.log("Inserting fake data.");
            
            if (argv.p) {
                numOfPosts = argv.p;
            }
    
            if (argv.u) {
                numOfUsers = argv.u;
            }
    
            if (argv.c) {
                numOfCats = argv.c;
            }
    
            await seedDB(numOfPosts, numOfUsers, numOfCats);
        }
        //if deleting data
        else if (argv.d) {
            await removeFakeData();
        }
        else {
            console.log("Please pass a viable option to the script (-i for insertion or -d for deletion).");
            console.log("Sample usage: node seedData.js -i -p 10 -u 5 -c 3");
        }
    
    } catch (error) {
        console.log(error); 
    } finally {
        closeConnection();
    }
}
main(process);



