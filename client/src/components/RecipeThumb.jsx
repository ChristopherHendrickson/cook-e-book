import { useState } from "react"
import Tags from "./Tags"

const RecipeThumb = ({ recipe, setDisplayRecipe }) => {

    const [imageLoaded,setImageLoaded] = useState(false)
    
    const handleLoad = () => {
        setImageLoaded(true)
    }

    return (
        <li className={`recipe-thumb`} onClick={()=>setDisplayRecipe(recipe)}>
            <img className={`recipe-thumb-img ${imageLoaded ? '': ' unloaded' }`} src={recipe.thumbnailURL} onLoad={handleLoad}></img>
                
            {!imageLoaded && recipe.thumbnailURL && <div className='image-loader'></div>}
            
            <div className='thumb-text-top'>
                <h4>{recipe.name} { recipe.favourite ? <span className='fav-sym'>♥</span> : '' }</h4>
                {recipe.numServings &&
                    <h6>Servings: {recipe.numServings}</h6>
                }
            </div>
            <div className='thumb-tags'>
                <Tags tags={recipe.tags}></Tags>
            </div>
        </li>
    )
}

export default RecipeThumb