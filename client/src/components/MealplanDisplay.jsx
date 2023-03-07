import { useState } from 'react'

import SavedRecipeList from './SavedRecipeList'
import LoaderThumbsMealPlan from './LoaderThumbsMealPlan'

import New from '../assets/new.png'
import Pick from '../assets/pick.png'

const MealplanDisplay = ({ mealplan, handleAllRandom, handleSingleUpdate, handleManualSelectRecipeForDay, setDisplayRecipe, selectedDays }) => {
    
    const [selectingForDay,setSelectingForDay] = useState(null)
    
    const manualSelect = (recipe) => {
        if (recipe) {
            handleManualSelectRecipeForDay(selectingForDay,recipe)
        }
        setSelectingForDay(null)
        return
    }

    return (
        <>
        {mealplan ?
        <>
            <ul className='meal-plan-ui'>
                <button className='btn-icon med' onClick={handleAllRandom}><img className='btn-icon-content' src={New}/></button>

                {Object.keys(mealplan.recipes).map((day)=>{
                    return (
                    <li className='meal-plan-day' key={`meal-${day}`}>
                        <div className='mp-1'>
                            <div className='day-title'>{day}</div>
                            <div className='day-servings'>{mealplan.recipes[day]?.numServings && mealplan.recipes[day]?.numServings + ' Servings'}</div>
                        </div>
                        {selectedDays.includes(day) ?
                        <div className='mp-2'>
                            {mealplan.recipes[day] ? 
                                <h4 className='meal-title' onClick={()=>setDisplayRecipe(mealplan.recipes[day])}>{mealplan.recipes[day].name}</h4>
                                :
                                <div className='meal-title removed'></div>
                            }
                            <div className='meal-plan-btns-container'>
                                <button className='btn-icon sm' onClick={()=>handleSingleUpdate(day,false)}><img className='btn-icon-content' src={New}></img></button>
                                <button className='btn-icon sm' onClick={()=>setSelectingForDay(day)}><img className='btn-icon-content' src={Pick}></img></button>
                            </div>
                        </div>
                        :
                        <div className='mp-2 deselect'>No meal for {day}</div>
                        }

                    </li>   
                    ) 
                })}
            </ul>
            {selectingForDay &&
                <SavedRecipeList handleClick={manualSelect} title={`Select a meal for ${selectingForDay}`}></SavedRecipeList>
            }
        </>
        :
        <LoaderThumbsMealPlan/>
        }
        </>
    )
}

export default MealplanDisplay
