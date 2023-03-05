

const Ingredients = ({ recipe }) => {
    return (
        <div className='ingredients'>
        <h4>Ingredients</h4>
        <ul>
            {recipe.components.map((component,i)=>{
                return <li key={`ing-${i}`}>{component.raw_text}</li>
            })}
        </ul>
        </div>

    )
}

export default Ingredients