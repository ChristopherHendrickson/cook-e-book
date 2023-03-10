import Button from 'react-bootstrap/Button'
import { useState, useContext, useEffect } from 'react'
import { SavedRecipesContext } from '../context/savedRecipesContext'

const SaveRecipeButton = ({ recipe }) => {
    const [savedRecipes, setSavedRecipes] = useContext(SavedRecipesContext)
    const [buttonText,setButtonText] = useState('Save Recipe')
    const [buttonDisable,setButtonDisable] = useState(false)

    useEffect(()=>{
        const recipeAlreadySaved = savedRecipes.find((r)=>r.apiID==recipe.apiID)
        if (recipeAlreadySaved) {
            setButtonDisable(true)
            setButtonText('Saved ✓')
        }
    },[savedRecipes])


    const handleClick = async () => {
        setButtonText('Saving...')
        setButtonDisable(true)

        const promise = await fetch('/api/internal/recipes', {
            method:'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(recipe)
        })
        if (promise.status==200) {
            const newlySavedRecipe = await promise.json()
            setButtonText('Saved ✓')
            setSavedRecipes([...savedRecipes,newlySavedRecipe])
        } else {
            setButtonText('Error Saving')
            setButtonDisable(false)

        }


    }
    return (
        <button className='btn-default' disabled={buttonDisable} onClick={handleClick}>{buttonText}</button>
    )
}

export default SaveRecipeButton