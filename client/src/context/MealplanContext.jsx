import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from './userContext'

export const MealplanContext = React.createContext()

export const MealplanProvider = ( { children } ) => {
    
    const [user, setUser] = useContext(UserContext)
    const [mealplan,setMealplan] = useState(null)
    
    
    const daysOfTheWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const mealplanRecipeTemplate = {}
    daysOfTheWeek.forEach((day)=>{
        mealplanRecipeTemplate[day]=null
    })


    useEffect(() => {
        const getMealplan = async () => {
            if (user) {
                const promise = await fetch('/api/internal/mealplan', {
                    method:'GET'
                })
                const mealplanData = await promise.json()
                if (promise.status==200) {
                    if (mealplanData.length>0) {
                        setMealplan(mealplanData[0])
                    } else {
                        setMealplan({recipes:mealplanRecipeTemplate,shoppingList:[]})
                    }
                }
            }
        }
        getMealplan()
    },[user])


    return (
        <MealplanContext.Provider value={[mealplan,setMealplan]}>
                {children}
        </MealplanContext.Provider>
    )
}

