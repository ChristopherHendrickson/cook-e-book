import TopNav from './TopNav'
import Loader from './Loader'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/userContext'
import Form from 'react-bootstrap/Form';    

import tagOptions from '../lib/tags'

import RecipeDetails from './RecipeDetails'
import TabNumbers from './TabNumbers'
import Recipe from './Recipe'
import SaveRecipeButton from './SaveRecipeButton'
import RecipeThumbList from './RecipeThumbList'
import Tags from './Tags'
import DropDown from './DropDown'


const Browse = () => {
    const [recipes, setRecipes] = useState({})
    const [selectedTags, setSelectedTags] = useState([])
    const [fields, setFields] = useState({query:''})
    const [error, setError] = useState(false)
    const [viewFrom, setViewFrom] = useState(0)
    const [highestLoadedFrom, setHighestLoadedFrom] = useState(null)
    const [displayRecipe,setDisplayRecipe] = useState(null)
    const [moreData, setMoreData] = useState(false)


    const handleChange = (event) => {
        const { name, value } = event.target
        setFields({
          [name]: value
        })
    }

    const handleSubmit = async (event,from) => {
        event.preventDefault()
        if (recipes[from] && event.target.id == 'load-more') {
            setViewFrom(from)
            return
        }
        
        const tagString = selectedTags.map((tag)=>{
            return tag.name
        }).join(',')
        
        const q = fields.query.replace(/[^a-zA-Z0-9 ]/g, '');

        let url = `api/external/recipes?q=${q}&from=${from}`
        if (tagString) {
            url+=`&tags=${tagString}`
        }
        console.log(url)
        const res = await fetch(url, {
            method: "GET",  
        })
        const recipeData = await res.json()
        if (res.status==200) {
            if (recipeData.length>0) {
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
                setError('Your search didn\'t return any results. Check your spelling and try using less / different key words.')
            }

        } else {
            setError('Something went wrong, please try again.')
        }
    }

    const handleTagToggle = ( tag ) => {

        let removed = false
        const filteredTags = selectedTags.filter((t)=>{
            if (t.display_name == tag.display_name) {
                removed=true
                return false
            } 
            return true
        })
        
        if (!removed) {
            filteredTags.push(tag)
        }
        console.log(filteredTags)
        setSelectedTags(filteredTags)
    }

    return (
        <Loader>
            <TopNav currentPage={'Browse'}/>
            <div className='page-content browse'>
            <h1>Browse For Recipes</h1>
            <DropDown title={'Select tags to personalise your search'}>
                <Tags tags={tagOptions} selectedTags={selectedTags} onClick={handleTagToggle}></Tags>
            </DropDown>
            <Form onSubmit={(event)=>{handleSubmit(event,0)}}>
                <label htmlFor="query">Search for new recipes</label>
                <br/>
                <input name="query" type="text" onChange={handleChange} id="query" value={fields.query} autoComplete="off"/>

                <input type='submit' value='Find Recipes'></input>
            </Form>
            {error && <p>{error}</p>}
            <RecipeThumbList recipes={recipes[viewFrom]} setDisplayRecipe={setDisplayRecipe}></RecipeThumbList>
            <TabNumbers moreData={moreData} viewFrom={viewFrom} setViewFrom={setViewFrom} highestLoadedFrom={highestLoadedFrom} handleSubmit={handleSubmit}/>   
            <Recipe 
                recipe={displayRecipe}
                handleClose={() => setDisplayRecipe(null)}
                header={<RecipeDetails recipe={displayRecipe}></RecipeDetails>}
                footer={<SaveRecipeButton recipe={displayRecipe}></SaveRecipeButton>}
                >
                
            </Recipe>
            </div>
        </Loader>
    
    )
}

export default Browse