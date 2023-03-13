

const Instructions = ({ recipe }) => {
    return (
        <div className='instructions'>
        <h4>Method</h4>
        <ol>
            {recipe.instructions.map((instruction,i)=>{
                return <li key={`inst-${i}`}>{instruction}</li>
            })}
        </ol>
        </div>

    )
}

export default Instructions