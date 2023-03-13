import React, { useContext, useEffect, useState } from 'react'
import { SavedRecipesContext } from './savedRecipesContext'
import tagOptions from '../lib/tags'

let initialRender=true

export const CustomTagsContext = React.createContext()

export const CustomTagsProvider = ( { children } ) => {
    
    const [savedRecipes,setSavedRecipes] = useContext(SavedRecipesContext)
    const [customTags,setCustomTags] = useState([])

    useEffect(() => {
        const extractTags = () => {
            if (initialRender && savedRecipes) {
                //only execute on initial render. 
                //updating state when adding new tags is handled in the edit component
                //to prevent this more demanding function running excessively
                initialRender = false
                const newCustomTags = []    
                const includedTagOptionNames = []

                tagOptions.forEach((tag)=>{
                    newCustomTags.push(tag)
                    includedTagOptionNames.push(tag.display_name.toLowerCase())
                })  

                savedRecipes.forEach((recipe)=>{
                    recipe.tags.forEach((tag)=>{
                        if (!includedTagOptionNames.includes(tag.display_name.toLowerCase()) && tag.type == 'custom') {
                            newCustomTags.push(tag)
                            includedTagOptionNames.push(tag.display_name.toLowerCase())
                        }
                    })
                })

                setCustomTags(newCustomTags)
            }
        }
        extractTags()
    },[savedRecipes])


    return (
        <CustomTagsContext.Provider value={[customTags,setCustomTags]}>
                {children}
        </CustomTagsContext.Provider>
    )
}

