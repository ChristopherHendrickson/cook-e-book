import Button from 'react-bootstrap/Button'
import { useState, useContext, useEffect } from 'react'
import { SavedRecipesContext } from '../context/savedRecipesContext'

const DeleteRecipeButton = ({ recipe, onClick }) => {
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
            <div className={`popup over right${popupVis ? ' show' : ''}`}>
                <h4 className='popup-header'>Confirm Delete</h4>
                <div className='popup-btn-contain'>
                    <button className="btn-default danger" onClick={handleClick}>Confirm</button>
                    <button className='btn-default' onClick={()=>setPopupVis(false)}>Cancel</button>
                </div>


            </div>
            <button className="btn-default danger" onClick={()=>setPopupVis(true)}>Delete Recipe</button>
        </div>
    )
}

export default DeleteRecipeButton