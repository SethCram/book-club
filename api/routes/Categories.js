const router = require("express").Router(); //can handle post, put (update), get, delete
const Category = require("../models/Category");

//Create Category
router.post("/", async (request, response) => {
    const newCategory = new Category(request.body);   //dont have to await bc just created locally
    try {
        const savedCategory = await newCategory.save();
        response.status(201).json(savedCategory);
    } catch (error) {
        response.status(500).json(error);
    }
});

//Get All Categories
router.get("/", async (request, response) => {
      
    try {
        const allCategories = await Category.find(); 
        response.status(200).json(allCategories);
    } catch (error) {
        response.status(500).json(error);
    }
});

module.exports = router;