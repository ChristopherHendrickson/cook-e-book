import Recipe from './Recipe'

const MealplanDisplay = ({ mealplan, handleSingleUpdate, setDisplayRecipe }) => {
    


    return (
        <>
        {mealplan &&
        <ul className='mealplan-ui'>
            {Object.keys(mealplan.recipes).map((day)=>{
                return (
                <li key={`meal-${day}`}>
                    <div className='day-title'>{day}</div>
                    
                    {mealplan.recipes[day] && <div onClick={()=>setDisplayRecipe(mealplan.recipes[day])} className='day-meal'>{mealplan.recipes[day].name}</div> || <div>No</div>}
                    <button onClick={()=>handleSingleUpdate(day,false)}>Change</button>
                    <button onClick={()=>handleSingleUpdate(day,true)}>Remove</button>
                </li>   
                ) 
            })}
        </ul>
        }
        </>
    )
}

export default MealplanDisplay
