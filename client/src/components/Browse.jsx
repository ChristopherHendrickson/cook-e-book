import { useState } from 'react'
import { UserContext } from '../context/userContext'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import tagOptions from '../lib/tags'

import Form from 'react-bootstrap/Form';    


import RecipeDetails from './RecipeDetails'
import TabNumbers from './TabNumbers'
import Recipe from './Recipe'
import SaveRecipeButton from './SaveRecipeButton'
import RecipeThumbList from './RecipeThumbList'
import Tags from './Tags'
import DropDown from './DropDown'
import TopNav from './TopNav'
import Loader from './Loader'
import BackToTop from './BackToTop';
import LoaderThumbsRecipeThumb from './LoaderThumbsRecipeThumb'


const Browse = () => {
    
    const [recipes, setRecipes] = useState({})
    const [filterTags, setFilterTags] = useState([])
    const [fields, setFields] = useState({query:''})
    const [viewFrom, setViewFrom] = useState(0)
    const [highestLoadedFrom, setHighestLoadedFrom] = useState(null)
    const [displayRecipe,setDisplayRecipe] = useState(null)
    const [moreData, setMoreData] = useState(false)
    const [requestPending,setRequestPending] = useState(false)

    const handleChange = (event) => {
        const { name, value } = event.target
        setFields({
            ...fields,
          [name]: value
        })
    }

    const handleSubmit = async (event,from) => {
        event.preventDefault()
        if (recipes[from] && event.target.id == 'load-more') {
            setViewFrom(from)
            return
        }

        setRequestPending(true)

        const tagString = filterTags.map((tag)=>{
            return tag.name
        }).join(',')
        
        const q = fields.query.replace(/[^a-zA-Z0-9 ]/g, '');

        let url = `/api/external/recipes?q=${q}&from=${from}`
        
        if (tagString) {
            url+=`&tags=${tagString}`
        }

        const res = await fetch(url, {
            method: "GET",  
        })
        if (res.status==200) {
            const recipeData = await res.json()

            if (recipeData.length>0) {
                if (event.target.id=='load-more') {
                    setRecipes({
                        ...recipes,
                        [from]:recipeData
                    })
                    setViewFrom(from)
                    setHighestLoadedFrom(from)
                    if (recipeData.length == 0) {
                        setHighestLoadedFrom(from-1)
                        setViewFrom(from-1)
                    }

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

            } else {
                toast.error('Your search didn\'t return any results. Check your spelling and try using less / different key words.')
            }

        } else {
            toast.error('Something went wrong, please try again soon.')
        }
        setRequestPending(false)

    }

    const handleFilterTagToggle = ( tag ) => {

        let removed = false
        const filteredTags = filterTags.filter((t)=>{
            if (t.display_name == tag.display_name) {
                removed=true
                return false
            } 
            return true
        })
        
        if (!removed) {
            filteredTags.push(tag)
        }
        setFilterTags(filteredTags)
    }

    return (
        <Loader>
            <TopNav currentPage={'Browse'}/>
            <div className='page-content browse'>
            <h1>Browse For Recipes</h1>
            <DropDown 
                title='Filters'
                size='lg'
                >
                <Tags tags={tagOptions} selectedTags={filterTags} onClick={handleFilterTagToggle}></Tags>
            </DropDown>
            <Form className='browse-form' onSubmit={(event)=>{handleSubmit(event,0)}}>
                <input className='input-text marg-10' name="query" type="text" onChange={handleChange} id="query" value={fields.query} autoComplete="off" placeholder="Optional search term"/>
                <input className='btn-default' type='submit' value='Find Recipes'></input>
            </Form>
            {requestPending ? 
                <LoaderThumbsRecipeThumb count={5}/>
                :
                <RecipeThumbList recipes={recipes[viewFrom]} setDisplayRecipe={setDisplayRecipe}></RecipeThumbList>
            }
            <TabNumbers moreData={moreData} viewFrom={viewFrom} setViewFrom={setViewFrom} highestLoadedFrom={highestLoadedFrom} handleSubmit={handleSubmit}/>   
            <Recipe 
                recipe={displayRecipe}
                handleClose={() => setDisplayRecipe(null)}
                header={<RecipeDetails recipe={displayRecipe}></RecipeDetails>}
                footer={<SaveRecipeButton recipe={displayRecipe}></SaveRecipeButton>}
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
            </div>
            <BackToTop/>
        </Loader>
    
    )
}

export default Browse