const mongoose = require('mongoose')


const recipeSchema = require('./recipeSchema')
const Recipe = mongoose.model('recipe', recipeSchema)
module.exports = Recipe
