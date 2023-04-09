const Badge = require("../models/Badge");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

function sortedIndex(array, value) {

    var low = 0,
        high = array.length;

    while (low < high) {
        var mid = (low + high) >>> 1;
        if (array[mid].score <= value) low = mid + 1;
        else high = mid;
    }
    return low;
};

const updateUserRep = async (additionalScore, username) => {

    let searchParam;

    //setup searchParam depending on what's been passed in
    if (username) {
        searchParam = { username };
    }
    else {
        throw new Error("Requires a userId or username to find user.");
    }

    const user = await User.findOne(searchParam);

    //if user found
    if (user) {

        //calc new score
        const newScore = user.reputation + additionalScore;

        //default update filter incr's rep by additional score
        let updateFilter = {
            reputation: newScore
        }

        const ASC = 1;

        //get all badges + sort them in ascending order
        const allBadges = await Badge.find().sort({ score: ASC });

        //make sure badges were retrieved
        if (allBadges) {

            //find where old+new scores would be inserted in ASC order arr
            let newScoreIndex = sortedIndex(allBadges, newScore);
            const oldScoreIndex = sortedIndex(allBadges, user.reputation);

            //if increasing score
            if (newScore > user.reputation) {

                //console.log(newScoreIndex);
                //console.log(oldScoreIndex);

                //if new score inserted at higher spot than old score, new badge must be inserted
                if (newScoreIndex > oldScoreIndex) {

                    //adjust score index if not zero
                    if (newScoreIndex !== 0) {
                        newScoreIndex -= 1;
                    }

                    updateFilter["badgeName"] = allBadges[newScoreIndex].name;
                }
            }
            //if decreasing score
            else if (newScore < user.reputation) {
                //console.log(newScoreIndex);
                //console.log(oldScoreIndex);

                //if new score inserted at lower spot than old score, new badge must be inserted
                if (newScoreIndex < oldScoreIndex) {

                    //adjust score index if not zero
                    if (newScoreIndex !== 0) {
                        newScoreIndex -= 1;
                    }

                    updateFilter["badgeName"] = allBadges[newScoreIndex].name;
                }
                
            }
        }

        //find the user and update their score
        const updatedUser = await User.findOneAndUpdate(
            searchParam,
            updateFilter,
            { new: true })
        
        const { password, email, ...publicUser } = updatedUser._doc;
        
        return publicUser;
    }
    else {
        throw new Error("Couldn't find user to update.")
    }
};

//JWT verify middleware
const verify = (request, response, next) => { //next is everything else
    const authHeader = request.headers.authorization;

    if (authHeader) {
        //seperate jwt from "Bearer "
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, payload) => {
            if (error) {
                return response.status(403).json("Token isn't valid.");
            }
            else {
                request.user = payload;
                next();
            }
        });
    } else {
        response.status(401).json("Authentication failed and refused.");
    }
}

module.exports = { updateUserRep, verify };