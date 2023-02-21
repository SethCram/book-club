const router = require("express").Router();
const Badge = require("../models/Badge");

router.post("/", async (request, response) => {
    try {
        const badge = new Badge(request.body);

        const savedBadge = await badge.save();

        response.status(200).json(savedBadge);
    }
    catch (error) {
        response.status(500).json(error);
    }
})

//query by any trivial search key
router.get("/:searchKey", async (request, response) => {
    try {
        const badge = await Badge.findOne({
            $get: request.params.searchKey
        })

        response.status(200).json(badge);
    }
    catch (error) {
        response.status(404).json(error);
    }
})

module.exports = router;