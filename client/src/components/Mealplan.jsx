import { useState, useEffect, useContext } from 'react'
import { MealplanContext } from '../context/MealplanContext'
import { SavedRecipesContext } from '../context/savedRecipesContext'

import TopNav from './TopNav'
import Loader from './Loader'
import MealplanDisplay from './MealplanDisplay'
import Button from 'react-bootstrap/Button'
import DropDown from './DropDown'
import DaySelector from './DaySelector'
import Recipe from './Recipe'

const daysOfTheWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const mealplanRecipeTemplate = {}
daysOfTheWeek.forEach((day)=>{
    mealplanRecipeTemplate[day]=null
})
let mealplanAlreadyRecieved = false

const MealPlan = () => {

    const [displayRecipe,setDisplayRecipe] = useState(null)
    const [savedRecipes, setSavedRecipes] = useContext(SavedRecipesContext)
    const [mealplan, setMealplan] = useContext(MealplanContext)
    const [mealplanDBState, setMealplanSavedState] = useState(mealplan)
    const [response, setResponse] = useState('')
    const [mealplanUpdated, setMealplanUpdated] = useState(false)
    const [selectedDays, setSelectedDays] = useState(daysOfTheWeek)


    useEffect(()=>{
        if (mealplan && !mealplanAlreadyRecieved) {
            console.log('saving db state')
            mealplanAlreadyRecieved = true
            setMealplanSavedState({...mealplan})
        }
    },[mealplan])


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
                setMealplanSavedState(data.mealplan)
                setResponse(data.message)
                setMealplanUpdated(false)
            } else {
                const error = await res.json()
                setResponse(error.message)
            }
        }
    }

    const handleUndo = () => {
        setMealplan(mealplanDBState)
        setMealplanUpdated(false)
    }

    const handleAllRandom = () => {
        const newRecipes = {...mealplanRecipeTemplate}
        selectedDays.forEach((day)=>{
            newRecipes[day] = savedRecipes[Math.floor(Math.random()*savedRecipes.length)]
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
            newRecipes[day] = savedRecipes[Math.floor(Math.random()*savedRecipes.length)]
        }
        setMealplan({
            ...mealplan,
            recipes:newRecipes
        })
        setMealplanUpdated(true)

    }



    return (
        <Loader>
            <TopNav currentPage={'Meal Plan'}/>
            <div className='page-content meal-plan'>
                <h1>My  Meal Plan</h1>
                <DropDown title='Select Days'>
                    <DaySelector selectedDays={selectedDays} setSelectedDays={setSelectedDays}></DaySelector>
                </DropDown>
                <Button onClick={handleAllRandom}>Randomize recipes</Button>
                <MealplanDisplay mealplan={mealplan} handleSingleUpdate={handleSingleUpdate} setDisplayRecipe={setDisplayRecipe}></MealplanDisplay>
                <Button disabled={!mealplanUpdated} onClick={handleSave}>Save Changes</Button>
                <Button disabled={!mealplanUpdated} onClick={handleUndo}>Undo Changes</Button>
                <p>{response}</p>
            </div>
            <Recipe 
                    recipe={displayRecipe}
                    handleClose={() => setDisplayRecipe(null)}
                    header={null}
                    footer={null}
                    >
                </Recipe>
        </Loader>
    )
}

export default MealPlan