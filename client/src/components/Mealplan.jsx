import { useState, useEffect, useContext } from 'react'
import { MealplanContext } from '../context/MealplanContext'
import { SavedRecipesContext } from '../context/savedRecipesContext'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import clone from 'deepclone'
import TopNav from './TopNav'
import Loader from './Loader'
import MealplanDisplay from './MealplanDisplay'
import DropDown from './DropDown'
import DaySelector from './DaySelector'
import Recipe from './Recipe'
import BackToTop from './BackToTop'
import RecipeDetails from './RecipeDetails' 
import Tags from './Tags'



const daysOfTheWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const mealplanRecipeTemplate = {}
daysOfTheWeek.forEach((day)=>{
    mealplanRecipeTemplate[day]=null
})

let mealplanAlreadyRecieved = false
let toastCooldown = false

const MealPlan = () => {

    const [savedRecipes, setSavedRecipes] = useContext(SavedRecipesContext)
    const [mealplanDBState, setMealplanDBState] = useContext(MealplanContext)
    const [displayRecipe,setDisplayRecipe] = useState(null)
    const [mealplan, setMealplan] = useState(clone(mealplanDBState))
    const [mealplanUpdated, setMealplanUpdated] = useState(false)
    const [selectedDays, setSelectedDays] = useState(daysOfTheWeek)
    const [filterByFavourites,setFilterByFavourites] = useState(false)
    const [filteredRecipes, setFilteredRecipes] = useState(savedRecipes)
    const [filterTags,setFilterTags] = useState([])
    

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
                setFilteredRecipes(filtered)
            } else {
                setFilteredRecipes([...savedRecipes])
            }
        }
    }

    const handleSave = async () => {
        if (mealplan && mealplanUpdated) {
            const res = await fetch('/api/internal/mealplan', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/JSON'
                },
                body: JSON.stringify({recipes:mealplan.recipes})
            })
            if (res.status==200) {
                const data = await res.json()
                setMealplan(data.mealplan)
                setMealplanDBState(data.mealplan)
                toast.success('Meal plan saved')
                setMealplanUpdated(false)
            } else {
                const error = await res.json()
                toast(error.message)
            }
        }
    }

    const handleUndo = () => {
        setMealplan(clone(mealplanDBState))
        setMealplanUpdated(false)
        const savedDays = Object.keys(mealplanDBState.recipes).filter((day)=>{
            return mealplanDBState.recipes[day]
        })
        setSelectedDays(savedDays)
    }

    const handleAllRandom = () => {
        const newRecipes = {...mealplanRecipeTemplate}
        if (filteredRecipes.length == 0) {
            if (!toastCooldown) {
                toastCooldown=true
                setTimeout(()=>{toastCooldown=false},3000)
                toast.info('No recipes match the given Filters')
            }

            return
        }
        selectedDays.forEach((day)=>{
            newRecipes[day] = filteredRecipes[Math.floor(Math.random()*filteredRecipes.length)]
        })
        setMealplan({
            ...mealplan,
            recipes:newRecipes
        })
        setMealplanUpdated(true)
    }

    const handleSingleUpdate = (day,remove) => {
        const newRecipes = {...mealplan.recipes}
        if (remove) {
            newRecipes[day] = null
        } else {
            if (filteredRecipes.length == 0) {
                if (!toastCooldown) {
                    toastCooldown=true
                    setTimeout(()=>{toastCooldown=false},3000)
                    toast.info('No recipes match the given Filters')
                }
                return
            }
            newRecipes[day] = filteredRecipes[Math.floor(Math.random()*filteredRecipes.length)]
        }
        setMealplan({
            ...mealplan,
            recipes:newRecipes
        })
        setMealplanUpdated(true)
    }

    const handleManualSelectRecipeForDay = (day,recipe) => {
        const newRecipes = {...mealplan.recipes}
        newRecipes[day] = recipe
        setMealplan({
            ...mealplan,
            recipes:newRecipes
        })
        setMealplanUpdated(true)
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


        if (mealplanDBState) {
            const savedDays = Object.keys(mealplanDBState.recipes).filter((day)=>{
                return mealplanDBState.recipes[day]
            })
            setSelectedDays(savedDays)
        }

        if (mealplanDBState && !mealplanAlreadyRecieved) {
            mealplanAlreadyRecieved = true
            setMealplan(clone(mealplanDBState))
        }
        
    },[mealplanDBState])

    useEffect(()=>{
        filterRecipes()
    },[savedRecipes,filterTags,filterByFavourites])



    return (
        <Loader>
            <TopNav currentPage={'Meal Plan'}/>
            <div className='page-content meal-plan'>
                <h1>My Meal Plan</h1>
                {savedRecipes?.length <= 0 ? <p>No recipes saved. Browse for some new ideas or add your own.</p> :
                <>
                    <DropDown 
                        title='Filters'
                        size='lg'
                        >
                        <Tags selectedTags={filterTags} onClick={handleFilterTagToggle}></Tags>
                        <span onClick={handleFilterFavouriteToggle} className={`favourite-button${filterByFavourites ? ' favourited' : ''}`}></span>
                    </DropDown>
                    <DropDown 
                        title='Days'
                        size='sm'
                        >
                        <DaySelector selectedDays={selectedDays} setSelectedDays={setSelectedDays} handleSingleUpdate={handleSingleUpdate}></DaySelector>
                    </DropDown>
                
                    {mealplanUpdated &&
                        <p>Remember to <span className='clickable' onClick={handleSave}>save your changes</span></p>
                    }

                    <MealplanDisplay mealplan={mealplan} handleAllRandom={handleAllRandom} handleSingleUpdate={handleSingleUpdate} handleManualSelectRecipeForDay={handleManualSelectRecipeForDay} setDisplayRecipe={setDisplayRecipe} selectedDays={selectedDays}></MealplanDisplay>
                    <button className='btn-default' disabled={!mealplanUpdated} onClick={handleSave}>Save Changes</button>
                    <button className='btn-default' disabled={!mealplanUpdated} onClick={handleUndo}>Undo Changes</button>
                </>

                }
            </div>

            <Recipe 
                recipe={displayRecipe}
                handleClose={() => setDisplayRecipe(null)}
                header={<RecipeDetails recipe={displayRecipe}></RecipeDetails>}
                footer={null}
                >
            </Recipe>
            <ToastContainer
                position="bottom-center"
                autoClose={3000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                pauseOnHover={false}
                theme="light"
            />
            <BackToTop/>
        </Loader>
    )
}

export default MealPlan