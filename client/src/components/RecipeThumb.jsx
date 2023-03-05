import Tags from "./Tags"

const RecipeThumb = ({ recipe, setDisplayRecipe }) => {

    
    return (
        <li className='recipe-thumb' onClick={()=>setDisplayRecipe(recipe)}>
            <img src={recipe.thumbnailURL}></img>
            <div className='thumb-text-top'>
                <h4>{recipe.name} { recipe.favourite ? <span className='fav-sym'>♥</span> : '' }</h4>
                <h6>Servings: {recipe.numServings}</h6>

            </div>
            <div className='thumb-tags'>
                <Tags tags={recipe.tags}></Tags>
            </div>
        </li>
    )
}

export default RecipeThumb