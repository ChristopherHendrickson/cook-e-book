import TopNav from './TopNav'
import Loader from './Loader'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/userContext'
import tags from '../lib/tags'

import TabNumbers from './TabNumbers'

const Browse = () => {
    const [user, setUser] = useContext(UserContext)
    const [recipes, setRecipes] = useState({})
    const [selectedTags, setSelectedTags] = useState([])
    const [optionTags, setOptionTags] = useState({})
    const [fields, setFields] = useState({query:''})
    const [error, setError] = useState(false)
    const [viewFrom, setViewFrom] = useState(0)
    const [highestLoadedFrom, setHighestLoadedFrom] = useState(null)

    const [moreData, setMoreData] = useState(false)

    useEffect(() => {
        const tagsObject = {}
        tags.forEach((tag)=>{
            tagsObject[tag] = tag
        }) 
        setOptionTags(tagsObject)
    },[])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFields({
          [name]: value
        })
    }

    const handleSubmit = async (event,from) => {
        event.preventDefault()
        //check cached data
        if (recipes[from]) {
            setViewFrom(from)
            return
        }
        //otherwise query api for more data
        const tagString = selectedTags.map((tag)=>{
            const res = tag.replaceAll(' ', '_')
            return res.toLowerCase()
        }).join(',')
        
        const q = fields.query.replace(/[^a-zA-Z0-9 ]/g, '');

        let url = `api/external/recipes?q=${q}&from=${from}`
        if (tagString) {
            url+=`&tags=${tagString}`
        }
        console.log(url)
        const res = await fetch(url, {
            method: "GET",  
            headers: {
                "Content-Type": "application/json"
            }
        })
        const recipeData = await res.json()
        if (res.status==200) {
            setError(false)
            if (event.target.id=='load-more') {
                setRecipes({
                    ...recipes,
                    [from]:recipeData
                })
                setViewFrom(from)
                setHighestLoadedFrom(from)

            } else {
                setRecipes({0:recipeData})
                setViewFrom(0)
                setHighestLoadedFrom(0)
            }

            if (recipeData.length < 15) {
                setMoreData(false)
            } else {
                setMoreData(true)
            }
            if (recipeData.length == 0) {
                setHighestLoadedFrom(from-1)
                setViewFrom(from-1)

            }

        } else {
            setError(true)
        }
    }

    const handleTagSelect = (event) => {
        const newOptionTags = {...optionTags}
        newOptionTags[event.target.value] = null
        setOptionTags(newOptionTags)
        setSelectedTags([...selectedTags,event.target.value])
    }

    const handleTagDeselect = (deselectedTag) => {
        
        const newSelectedTags = selectedTags.filter((tag)=>{
            return tag !== deselectedTag
        })
        setSelectedTags(newSelectedTags)
        setOptionTags({
            ...optionTags,
            [deselectedTag]:deselectedTag
        })
    }   

    return (
    <>
    <form onSubmit={(event)=>{handleSubmit(event,0)}}>
        <label htmlFor="query">Search for new recipes {`(try "lasagne" or "beef stir fry")`}</label>
        <br/>
        <input name="query" type="text" onChange={handleChange} id="quert" value={fields.query} autoComplete="off"/>
        <br/>
        <select multiple={true} onClick={handleTagSelect}>
            {Object.keys(optionTags).map((tag)=>{
                return optionTags[tag] && <option key={optionTags[tag]}>{optionTags[tag]}</option>
            })}
        </select>
        <br/>
        <div id='selected-tags'>
            {selectedTags && 
            <ul>
                {selectedTags.map((tag)=>{
                    return <li onClick={()=>handleTagDeselect(tag)} key={`${tag}-selected`}>{tag}</li>
                })}
            </ul>
            }
        </div>
        <input type='submit' value='Find Recipes'></input>
    </form>
    {error && <p>Something went wrong, please try again..</p>}
    {recipes && 
    <>
        <ul>
            {recipes[viewFrom]?.map((recipe,i)=>{
                return <li key={`${recipe.apiID}${i}`}>{recipe.name}
                    <ul>{recipe.tags.map((tag,i)=>{
                        return <li key={`${recipe.apiID}${tag.name}${i}`}>{tag.name}</li>
                    })}
                    </ul>
                </li>
            })}
        </ul>
        <TabNumbers moreData={moreData} viewFrom={viewFrom} highestLoadedFrom={highestLoadedFrom} handleSubmit={handleSubmit}/>   
    </>
    }
    </>
    
    )
}
  
export default Browse