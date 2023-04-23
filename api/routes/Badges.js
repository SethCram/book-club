const router = require("express").Router();
const Badge = require("../models/Badge");
const { verify } = require("./HelperFunctions");

router.post("/", verify, async (request, response) => {

    if (!request.user.isAdmin) {
        response.status(403).json("Only admins can create new badges");
    }

    try {
        const badge = new Badge(request.body);

        const savedBadge = await badge.save();

        response.status(201).json(savedBadge);
    }
    catch (error) {
        response.status(500).json(error);
    }
})

//query by score or name (both unique)
router.get("/get/", async (request, response) => {
    try {

        let badge = {};

        if (request.query.score) {
            badge = await Badge.findOne({
                score: request.query.score
            })
        }
        else if (request.query.name) {
            badge = await Badge.findOne({
                name: request.query.name
            })
        }

        response.status(200).json(badge);
    }
    catch (error) {
        response.status(404).json(error);
    }
})

module.exports = router;