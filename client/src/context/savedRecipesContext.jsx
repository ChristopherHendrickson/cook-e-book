import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from './userContext'

export const SavedRecipesContext = React.createContext()

export const SavedRecipeProvider = ( { children } ) => {
    
    const [user, setUser] = useContext(UserContext)
    const [savedRecipes,setSavedRecipes] = useState([])
    
    useEffect(() => {
        const getRecipes = async () => {
            if (user) {
                const promise = await fetch('/api/internal/recipes', {
                    method:'GET'
                })
                const recipesData = await promise.json()
                if (promise.status==200) {
                    setSavedRecipes(recipesData)
                }
            }
        }
        getRecipes()
    },[user])


    return (
        <SavedRecipesContext.Provider value={[savedRecipes,setSavedRecipes]}>
                {children}
        </SavedRecipesContext.Provider>
    )
}

