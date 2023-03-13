import { useState, useEffect, useContext } from 'react'

import { SavedRecipesContext } from '../context/savedRecipesContext'

import TopNav from './TopNav'
import Loader from './Loader'
import RecipeThumbList from './RecipeThumbList'
import Recipe from './Recipe'
import FavouriteButton from './FavouriteButton'
import RecipeDetails from './RecipeDetails'
import DropDown from './DropDown'
import Tags from './Tags'
import BackToTop from './BackToTop'
import LoaderThumbsRecipeThumb from './LoaderThumbsRecipeThumb'
import DeleteRecipeButton from './DeleteRecipeButton'
import EditRecipe from './EditRecipe'
import EditRecipeButton from './EditRecipeButton'


const Cookbook = () => {
    const [savedRecipes, setSavedRecipes] = useContext(SavedRecipesContext)
    const [displayRecipe,setDisplayRecipe] = useState(null)
    const [editRecipe,setEditRecipe] = useState(null)
    const [filteredRecipes, setFilteredRecipes] = useState(savedRecipes)
    const [filterTags,setFilterTags] = useState([])
    const [filterByFavourites,setFilterByFavourites] = useState(false)
    
    
    
    const filterRecipes = () => {
        if (savedRecipes) {
            if (filterTags.length > 0 || filterByFavourites) {
                const filtered = [...savedRecipes].filter((recipe)=>{
                    const recipeTagNames = recipe.tags.map((tag)=>tag.name)
                    const tagTest = filterTags.every((filter)=>{
                        return recipeTagNames.includes(filter.name)
                    })
                    const favTest = filterByFavourites ? recipe.favourite : true 
                    return tagTest && favTest
                })
                setFilteredRecipes(filtered.reverse())
            } else {
                setFilteredRecipes([...savedRecipes].reverse())

            }
        } else {
            setFilteredRecipes(null)
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
        setFilterByFavourites(!filterByFavourites)
    }

    useEffect(()=>{
        filterRecipes()
    },[savedRecipes,filterTags,filterByFavourites])
    


    return (  
        <Loader>
            <TopNav currentPage={'Cookbook'}/>  
            <div className='page-content cookbook'>
                <h1>My Cookbook</h1>
                <button className='btn-default' onClick={()=>{
                        setEditRecipe({})
                    }}>Add a New Recipe</button>
                <DropDown 
                    title='Filters'
                    size='lg'
                    >
                    <Tags selectedTags={filterTags} onClick={handleFilterTagToggle}></Tags>
                    <span onClick={handleFilterFavouriteToggle} className={`favourite-button${filterByFavourites ? ' favourited' : ''}`}></span>
                </DropDown>

                {savedRecipes ?
                    savedRecipes.length>0 ? 
                        <RecipeThumbList recipes={filteredRecipes} setDisplayRecipe={setDisplayRecipe}></RecipeThumbList>
                        :
                        <div>No recipes saved. Browse for some new ideas or add your own.</div>
                    :
                    <LoaderThumbsRecipeThumb count={2}/>

                }    
                <Recipe 
                    recipe={displayRecipe}
                    handleClose={() => setDisplayRecipe(null)}
                    header={
                        <>
                        <RecipeDetails recipe={displayRecipe}></RecipeDetails>
                        <FavouriteButton displayRecipe={displayRecipe} savedRecipes={savedRecipes} setSavedRecipes={setSavedRecipes} setDisplayRecipe={setDisplayRecipe}></FavouriteButton>
                        </>
                    }
                    footer={
                    <>
                        <DeleteRecipeButton recipe={displayRecipe} onClick={()=>setDisplayRecipe(null)}></DeleteRecipeButton>
                        <EditRecipeButton handleClick={()=> {
                            setEditRecipe(displayRecipe)
                            setDisplayRecipe(null)
                        }
                        }></EditRecipeButton>
                    </>
                    }
                    >
                    
                </Recipe>
                <EditRecipe
                    recipe={editRecipe}
                    handleClose={()=> setEditRecipe(null)}
                    >
                </EditRecipe>
  
            <BackToTop/>

            </div>

        </Loader>

    )
}

export default Cookbook