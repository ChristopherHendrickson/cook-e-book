const express = require('express')
const router = express.Router()
require('dotenv').config()
const X_RapidAPI_Key = process.env.X_RapidAPI_Key
const X_RapidAPI_Host = process.env.X_RapidAPI_Host
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));


const getTastyApiResponse = async(req,res,next) => {

    let url = `https://tasty.p.rapidapi.com/recipes/list?size=15&tags=dinner`;

    if (req.query.tags) {
        url+=`,${req.query.tags}`
    }

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

    if (responseData.status==200) {
        const response = await responseData.json()
        if (response.results) { // api has bad error handling, error objects are returned with status 200 with inconsistent object keys. So assuming if there are no results it is an error. 
            return {
                status:200,
                data:response.results,
                message:'success'
            } 
        } else {
            return {
                status:400,
                data:null,
                message:'Bad Request'
            } 
        }
    } else {
        return {
            status:500,
            data:null,
            message:'External API Error'
        } 
    }

    
}


const internalRecipeMapper = (recipeData) => {
    
    const extractComponents = (recipe) => {
        const exrtactedComponents = []
        recipe.sections.forEach((section)=>{
            section.components.forEach((component)=>{
    
                const measurementObject = component.measurements[0] 
                
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
        const includedTagTypes = ['dietary','cuisine','healthy','difficulty'] 
        let timeTagAlreadyIncluded = false

        recipeData.tags.forEach((tag)=>{
            if (includedTagTypes.includes(tag.type) && !(timeTagAlreadyIncluded && tag.name.includes('under'))) {
                extractedTags.push({
                    type:tag.type,
                    display_name:tag.display_name,
                    name:tag.name
                })
            }
            if (tag.type == 'difficulty' && tag.name.includes('under')) {
                timeTagAlreadyIncluded = true
            }
        })
        return extractedTags
    }

    const mappedRecipes = []
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
            totalPrepTime:recipe.total_time_minutes,
            numServings:recipe.num_servings,
            thumbnailURL:recipe.thumbnail_url
        }
        mappedRecipes.push(newRecipe)
    })
    return mappedRecipes

}



const mappedRecipeListGenerator = async(req,res,next) => {
    const apiResponse = await getTastyApiResponse(req,res,next)
    if (apiResponse.status==200) {
        const mappedRecipes = internalRecipeMapper(apiResponse.data)
        return {
            status:200,
            data:mappedRecipes,
            message:'Success'
        }
    } else {
        return apiResponse
    }



}

router.get('/api/external/recipes/', async(req,res,next) => {
    const response = await mappedRecipeListGenerator(req,res,next)
    if (response.status==200) {
        res.json(response.data)
    } else {
        res.status(response.status).json(response.message)
    }
})

module.exports = router