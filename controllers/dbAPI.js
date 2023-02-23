const express = require('express')
const router = express.Router()
require('dotenv').config()
const User = require('../models/user')
const mealPlan = require('../models/mealPlan')
const Recipe = require('../models/recipe')
const authenticate = require('../middlewares/authenticate')

const generateShoppingList = (mealPlan,res) => {
    // shoppingList:[{
    //     name:String,
    //     quantities:[{
    //         quantity:String,
    //         unit:String
    //     }],
    //     gotten:Boolean
    // }]
    const shoppingList = []
    const seenIngredients = []


    mealPlan.recipes.forEach((recipe)=>{
        recipe.components.forEach((component)=>{
            const ingredientName = component.ingredient.name
            const ingredientUnit = component.measurement.unitAbbreviation
            const ingredientQuantity = component.measurement.quantity

            if (seenIngredients.includes(ingredientName)) {

                const ingredientEntryOfSameName = shoppingList.find((ingred)=>{
                    return ingred.name == ingredientName
                })
                const quantityEntryOfSameUnit = ingredientEntryOfSameName.quantities.find((ingred)=> {
                    return ingred.unit == ingredientUnit
                })
                
                if (quantityEntryOfSameUnit) {
                    quantityEntryOfSameUnit.quantity = String(Number(quantityEntryOfSameUnit.quantity) + Number(ingredientQuantity) || quantityEntryOfSameUnit.quantity + ` ${ingredientQuantity}`)
                    if (quantityEntryOfSameUnit.quantity == '0 0') {
                        quantityEntryOfSameUnit.quantity = '0'
                    }
                } else {
                    ingredientEntryOfSameName.quantities.push({
                        quantity:ingredientQuantity,
                        unit:ingredientUnit
                    })
                }
                
            } else {
                shoppingList.push({
                    name:ingredientName,
                    quantities:[{
                        quantity:ingredientQuantity,
                        unit:ingredientUnit
                    }]
                })
                seenIngredients.push(ingredientName)
            }
        })
    })
    mealPlan.shoppingList = shoppingList

}



router.get('/api/internal/recipes', authenticate, async(req,res,next)=>{
    const userID = req.user.id
    const recipeData = await Recipe.find({ userID: userID })
    res.json(recipeData)
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

router.get('/api/internal/mealplan', authenticate, async(req,res)=>{
    const userID = req.user.id
    const mealPlanData = await mealPlan
        .find({ userID: userID })
        .sort({ created: "desc" })
        .limit(1)
    res.json(mealPlanData)
})

router.put('/api/internal/mealPlan', authenticate, async(req,res,next)=>{
    const mealPlanDocumentLimit = 30
    const userID = req.user.id
    const newMealPlan = new mealPlan(req.body)
    newMealPlan.created = new Date
    newMealPlan.userID = userID

    const validationError = newMealPlan.validateSync()
    if (validationError) {
        return next(validationError)
    } else {
        generateShoppingList(newMealPlan,res)
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