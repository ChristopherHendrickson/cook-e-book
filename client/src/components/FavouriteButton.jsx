import { useEffect } from "react"

const FavouriteButton = ({ displayRecipe, savedRecipes, setSavedRecipes, setDisplayRecipe }) => {
    
    
    const handleToggle = async () => {
        const res = await fetch(`/api/internal/recipes/${displayRecipe._id.toString()}`, {
            method:'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({favourite:!displayRecipe.favourite})
        })
        if (res.status==200) {
            const updatedRecipe = await res.json()
            const newSavedRecipes = savedRecipes.filter((r)=>{
                return r._id.toString() !== displayRecipe._id.toString()
            })
            
            setDisplayRecipe(updatedRecipe)
            newSavedRecipes.push(updatedRecipe)
            newSavedRecipes.sort((a, b) => new Date(a.created) - new Date(b.created))
            setSavedRecipes(newSavedRecipes)
        }
    }

    return (
        <span onClick={handleToggle} className={`favourite-button${displayRecipe.favourite ? ' favourited' : ''}`}></span>
    )
}

export default FavouriteButton
