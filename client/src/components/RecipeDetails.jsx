
const NewRecipeDetails = ( { recipe } ) => {
    
    return (
        <div className='recipe-info'>
            {recipe.numServings && 
                <span>Serves {recipe.numServings} </span>
            }
            {recipe.totalPrepTime > 0 &&
                <span>{recipe.totalPrepTime} Minutes</span>
            }
        </div>
    )
}

export default NewRecipeDetails