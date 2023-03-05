import RecipeThumb from './RecipeThumb'

const RecipeThumbList = ({ recipes, setDisplayRecipe  }) => {
    return (
        <>
        {recipes && 
            <ul className='recipe-thumbs'>
                {recipes.map((recipe,i)=>{
                    return <RecipeThumb key={`recipe-${i}`} recipe={recipe} setDisplayRecipe={setDisplayRecipe}></RecipeThumb>
                })}
            </ul>
        }
        </>
    )
}

export default RecipeThumbList