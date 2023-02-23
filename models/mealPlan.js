const mongoose = require('mongoose')
const Schema = mongoose.Schema
const recipeSchema = require('./recipeSchema')

const MealPlanSchema = new Schema({
    created:Date,
    userID:{type:Schema.Types.ObjectId,  ref: "User", required:true},
    recipes:[recipeSchema],
    shoppingList:[{
        name:String,
        quantities:[{
            quantity:String,
            unit:String
        }],
        gotten:Boolean
    }],
})

const MealPlan = mongoose.model('mealPlan', MealPlanSchema)

module.exports = MealPlan
