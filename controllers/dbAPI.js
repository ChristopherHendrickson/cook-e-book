const express = require('express')
const router = express.Router()
require('dotenv').config()
const mealPlan = require('../models/mealPlan')
const Recipe = require('../models/recipe')
const authenticate = require('../middlewares/authenticate')
const ShoppingListGenerator = require('../lib/shoppingListGenerator')



router.get('/api/internal/recipes', authenticate, async(req,res,next)=>{
    const userID = req.user.id
    const recipeData = await Recipe.find({ userID: userID })
    res.json(recipeData)
})

router.put('/api/internal/toggleIngredientGotten/:id', authenticate, async(req,res,next)=>{
     mealPlan.findOne({ "shoppingList._id": req.params.id }, async (err,plan) => {
        if (err) {
            return next(err)
        }
        if (!plan) {
            return res.status(404).json({message:`subdoc ${req.params.id} not found in any mealPlan`})
        }
        if (plan.userID.toString() !== req.user.id) {
            return res.status(401).json({message: 'Not authorized'});
        }

        const ingredient = plan.shoppingList.find((i) => {
            return i._id.toString() == req.params.id
        });

        ingredient.gotten = !ingredient.gotten
        plan.save()
        return res.json({
            message:"Success",
            ingredient:ingredient.name,
            newState:ingredient.gotten
        })
    });
})

router.post('/api/internal/recipes', authenticate, async (req,res,next)=>{

    const newRecipe = new Recipe(req.body)
    newRecipe.userID = req.user.id
    const validationError = newRecipe.validateSync()
    if (validationError) {
        return next(validationError)
    } else {
        newRecipe.save()
        res.json(newRecipe)
    }
})

router.put('/api/internal/recipes/:id', authenticate, async(req,res,next) => {
    Recipe.findOne( {_id:req.params.id}, async (err,recipe) => {
        if (err) {
            return next(err)
        }
        if (!recipe) {
            return res.status(404).json({message: 'Recipe not found'});
        }
        if (recipe.userID.toString() !== req.user.id) {
            return res.status(401).json({message: 'Not authorized'});
        }
        //these should not change
        req.body._id = recipe._id
        req.body.userID = recipe.userID
        req.body.apiID = recipe.apiID

        const updateResponse = await recipe.update({$set: req.body})
        res.json(updateResponse)
    } )
})



router.delete('/api/internal/recipes/:id', authenticate, async (req,res,next) => {
    Recipe.findOne( {_id:req.params.id}, async (err,recipe) => {
        if (err) {
            return next(err)
        }
        if (!recipe) {
            return res.status(404).json({message: 'Recipe not found'});
        }
        if (recipe.userID.toString() !== req.user.id) {
            return res.status(401).json({message: 'Not authorized'});
        }
        const deletedRecipe = await recipe.remove() 
        return res.json(deletedRecipe);
    }) 
})

router.get('/api/internal/mealplan', authenticate, async(req,res)=>{
    // optional "count" and "skip" queries
    // if no query is given the route defaults to return most recent meal plan, with count=1
    const userID = req.user.id
    const mealPlanData = await mealPlan
        .find({ userID: userID })
        .sort({ created: "desc" })
        .skip(req.query.skip || 0)
        .limit(req.query.count || 1)
    console.log(mealPlanData.length)
    res.json(mealPlanData)
})



router.post('/api/internal/mealPlan', authenticate, async(req,res,next)=>{
    //expects a list of recipes fitting the recipeSchema in the body of the http PUT request - {recipes: []}
    const mealPlanDocumentLimit = 30
    const userID = req.user.id
    const newMealPlan = new mealPlan(req.body)
    newMealPlan.created = new Date
    newMealPlan.userID = userID

    const validationError = newMealPlan.validateSync()
    if (validationError) {
        return next(validationError)
    } else {
        ShoppingListGenerator.generate(newMealPlan)
        const resp = await newMealPlan.save()

        const documentCount = await mealPlan.countDocuments({ userID: userID })
        if (documentCount > mealPlanDocumentLimit) {
            const documentsToDelete = await mealPlan
                .find({ userID: userID })
                .sort({ created: 'desc' })
                .skip(mealPlanDocumentLimit);
          
            await mealPlan.deleteMany({ _id: { $in: documentsToDelete.map(doc => doc._id) } });
        }
        res.json(newMealPlan)
    }
})

module.exports = router