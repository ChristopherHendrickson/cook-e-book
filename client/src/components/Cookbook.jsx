import { useState, useEffect, useContext } from 'react'

import { SavedRecipesContext } from '../context/savedRecipesContext'

import TopNav from './TopNav'
import Loader from './Loader'
import RecipeThumbList from './RecipeThumbList'
import Recipe from './Recipe'
import FavouriteButton from './FavouriteButton'
import RecipeDetails from './RecipeDetails'
import tagOptions from '../lib/tags'
import DropDown from './DropDown'
import Tags from './Tags'

const Cookbook = () => {
    const [savedRecipes, setSavedRecipes] = useContext(SavedRecipesContext)
    const [displayRecipe,setDisplayRecipe] = useState(null)
    const [filteredRecipes, setFilteredRecipes] = useState(savedRecipes)
    const [filterTags,setFilterTags] = useState([])
    const [filterbyFavourites,setFilterByFavourites] = useState(false)

    const filterByTags = () => {
        if (filterTags.length > 0 || filterbyFavourites) {
            const filtered = savedRecipes.filter((recipe)=>{
                const recipeTagNames = recipe.tags.map((tag)=>tag.name)
                const tagTest = filterTags.every((filter)=>{
                    return recipeTagNames.includes(filter.name)
                })
                const favTest = filterbyFavourites ? recipe.favourite : true 
                return tagTest && favTest
            })
            setFilteredRecipes(filtered)
        } else {
            setFilteredRecipes([...savedRecipes])

        }
    }


    const handleFilterTagToggle = ( tag ) => {
        let removed = false
        const newFilterTags = filterTags.filter((t)=>{
            if (t.name == tag.name) {
                removed=true
                return false
            } 
            return true
        })
        
        if (!removed) {
            newFilterTags.push(tag)
        }
        setFilterTags(newFilterTags)
    }

    const handleFilterFavouriteToggle = () => {
        setFilterByFavourites(!filterbyFavourites)
    }

    useEffect(()=>{
        filterByTags(filterTags)
    },[savedRecipes,filterTags,filterbyFavourites])
    


    return (  
        <Loader>
            <TopNav currentPage={'Cookbook'}/>
            <div className='page-content cookbook'>
                <h1>My Cookbook</h1>
            
                <DropDown title={'Filter'}>
                    <Tags tags={tagOptions} selectedTags={filterTags} onClick={handleFilterTagToggle}></Tags>
                    <span onClick={handleFilterFavouriteToggle} className={`favourite-button${filterbyFavourites ? ' favourited' : ''}`}></span>
                </DropDown>
                
                <RecipeThumbList recipes={filteredRecipes} setDisplayRecipe={setDisplayRecipe}></RecipeThumbList>
                <Recipe 
                    recipe={displayRecipe}
                    handleClose={() => setDisplayRecipe(null)}
                    header={
                        <>
                        <RecipeDetails recipe={displayRecipe}></RecipeDetails>
                        <FavouriteButton displayRecipe={displayRecipe} savedRecipes={savedRecipes} setSavedRecipes={setSavedRecipes} setDisplayRecipe={setDisplayRecipe}></FavouriteButton>
                        </>
                    }
                    footer={null}
                    >
                    
                </Recipe>
            </div>
        </Loader>

    )
}

export default Cookbook