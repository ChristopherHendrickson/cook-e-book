const express = require('express')
const router = express.Router()
require('dotenv').config()
const X_RapidAPI_Key = process.env.X_RapidAPI_Key
const X_RapidAPI_Host = process.env.X_RapidAPI_Host



const getTastyApiResponse = async(req) => {
    let url = `https://tasty.p.rapidapi.com/recipes/list?size=15&tags=dinner`;

    if (req.query.q) {
        url+=`&q=${req.query.q}`
    }
    if (req.query.from) {
        url+=`&from=${req.query.from}`
    }
    

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': X_RapidAPI_Key,
            'X-RapidAPI-Host': X_RapidAPI_Host
            }
    };

    const responseData = await fetch(url, options)
    const response = await responseData.json()
    return response.results
}


const internalRecipeMapper = (recipeData) => {
    
    const extractComponents = (recipe) => {
        const exrtactedComponents = []
        recipe.sections.forEach((section)=>{
            section.components.forEach((component)=>{
                let measurementObject = component.measurements.filter((measurement)=>{
                    return measurement.unit.system == 'metric' 
                })[0] 

                if (!measurementObject) {
                    measurementObject = component.measurements[0] 
                    if(!measurementObject) { console.log(recipe.id)}
                }

                

                exrtactedComponents.push({
                    raw_text:component.raw_text,
                    ingredient:{
                        name:component.ingredient.name,
                        displaySingular:component.ingredient.display_singular,
                        displayPlural:component.ingredient.display_plural
                    },
                    measurement:{
                        quantity:measurementObject?.quantity || 0,
                        unit:measurementObject?.unit.name || "",
                        unitAbbreviation:measurementObject?.unit.abbreviation || ""
                    }

                })
            })
        })
        return exrtactedComponents
    }

    const extractInstructions = (recipeData) => {
        const extractedInstructions = []
        recipeData.instructions.forEach((instruction) => {
            extractedInstructions.push(instruction.display_text)
        })
        return extractedInstructions
    }

    const extractTags = (recipeData) => {
        const extractedTags = []
        const includedTagTypes = ['dietary','cuisine','healthy'] 
        recipeData.tags.forEach((tag)=>{
            if (includedTagTypes.includes(tag.type)) {
                extractedTags.push({
                    type:tag.type,
                    name:tag.display_name
                })
            }
        })
        return extractedTags
    }

    const newRecipes = []

    recipeData.forEach((recipe)=>{
        if (Object.keys(recipe).includes('recipes')) {
            recipe = recipe.recipes[0]
        }

        const newRecipe = {
            name:recipe.name,
            apiID:recipe.id,
            components:extractComponents(recipe),
            instructions:extractInstructions(recipe),
            favourite:false,
            active:true,
            tags:extractTags(recipe),
            numServings:recipe.num_servings,
            thumbnailURL:recipe.thumbnail_url
        }
        newRecipes.push(newRecipe)
    })
    return newRecipes

}



const mappedRecipeListGenerator = async(req) => {
    const apiResponse = await getTastyApiResponse(req)
    return internalRecipeMapper(apiResponse)
}

router.get('/api/external/recipes/', async(req,res) => {
    const response = await mappedRecipeListGenerator(req)
    res.json(response)
})

module.exports = router