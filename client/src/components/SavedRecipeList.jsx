import { useState, useContext, useEffect } from 'react'


import { SavedRecipesContext } from '../context/savedRecipesContext'
import Remove from '../assets/remove.png'

const SavedRecipeList = ({ handleClick, title }) => {

    const [savedRecipes, setSavedRecipes] = useContext(SavedRecipesContext)
    const [orderedRecipes,setOrderedRecipes] = useState([])
    
    const addSelfDestructingEventListener = (element, eventType, callback) => {
        let handler = (event) => {
            if (event.target.id == 's-rec-id') {
                callback();
                element.removeEventListener(eventType, handler)
            }
        }
        element.addEventListener(eventType, handler);
    }

    useEffect(()=>{
        const sorted = [...savedRecipes]
        sorted.sort((a,b)=>{
            if (a.name>b.name) {
                return 1
            } else if (a.name<b.name) {
                return -1
            }
            return 0
        })
        setOrderedRecipes(sorted)
    },[savedRecipes])

    useEffect(()=>{
        addSelfDestructingEventListener(window,'click',()=>{
            handleClick(null)
            console.log('aa')
        })
    },[])

    return (
        <div id='s-rec-id' className='s-rec-con'>
        <div className='s-rec'>
            <div className='s-rec-top'>
                <div className='s-rec-title'>{title}</div>
                <button className='btn-icon sm'><img className='btn-icon-content' onClick={()=>handleClick(null)} src={Remove}></img></button>
            </div>
            <ul className='s-rec-ul'>
                {orderedRecipes.map((recipe,i)=>{
                    return <li className='s-rec-li' onClick={()=>handleClick(recipe)} key={`s-r-${i}`}>{recipe.name}</li>
                })}            
            </ul>       
        </div>
        </div>
    )
}

export default SavedRecipeList