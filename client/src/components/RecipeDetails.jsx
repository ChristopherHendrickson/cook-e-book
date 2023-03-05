
const NewRecipeDetails = ( { recipe } ) => {
    
    return (
        <div className='recipe-info'>
            <span>Serves {recipe.numServings} </span>
            {recipe.totalPrepTime > 0 &&
                <span>{recipe.totalPrepTime} Minutes</span>
            }
        </div>
    )
}

export default NewRecipeDetails