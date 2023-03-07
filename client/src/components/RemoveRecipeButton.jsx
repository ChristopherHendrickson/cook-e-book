import Button from 'react-bootstrap/Button'
import { useState, useContext, useEffect } from 'react'
import { SavedRecipesContext } from '../context/savedRecipesContext'

const RemoveRecipeButton = ({ recipe, onClick }) => {
    const [savedRecipes, setSavedRecipes] = useContext(SavedRecipesContext)
    const [popupVis,setPopupVis] = useState(false)


    const handleClick = async () => {
        onClick()
        const promise = await fetch(`/api/internal/recipes/${recipe._id.toString()}`, {
            method:'DELETE'
        })
        const newSavedRecipes = savedRecipes.filter((r)=>{
            return r._id.toString() != recipe._id.toString()
        })
        setSavedRecipes(newSavedRecipes)

    }

    return (
        <div className='popup-container'>
            <div className={`popup${popupVis ? ' show' : ''}`}>
                <h4>Confirm Delete</h4>
                <div className='delete-con-btn-c'>
                    <Button variant="dark" onClick={handleClick}>Confirm</Button>
                    <Button variant='secondary' onClick={()=>setPopupVis(false)}>Cancel</Button>
                </div>


            </div>
            <Button variant="dark" onClick={()=>setPopupVis(true)}>Delete Recipe</Button>
        </div>
    )
}

export default RemoveRecipeButton