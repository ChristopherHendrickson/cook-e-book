


const LoaderThumbsRecipeThumb = ({ count }) => {


    const mapper = [...Array(count).keys()]
    
    return (
        <ul className='recipe-thumbs'>
            {mapper.map((a,b)=>{
                return (
                    <li key={`loader-rth-${b}`} className='recipe-thumb'>
                    <div className='image-loader'></div>
                    <div className='thumb-text-top'>
                        <h4 className='shadow-text'>One-Pan Southwestern Chicken Quinoa</h4>
                        <h6 className='shadow-text'>Servings: 4</h6>
                    </div>
                    <div className='thumb-tags'>
                        <ul className="tags">
                            <li className={`tag-deselected shadow-text`}>Vegan</li>
                            <li className={`tag-deselected shadow-text`}>Healthy</li>
                            <li className={`tag-deselected shadow-text`}>Vary Length Tag</li>
                            <li className={`tag-deselected shadow-text`}>Low-fat</li>
                            <li className={`tag-deselected shadow-text`}>Filler Text</li>
                            <li className={`tag-deselected shadow-text`}>Low-fat</li>
                        </ul>
                    </div>
                </li>
                )
            })}
        </ul>

    )
}

export default LoaderThumbsRecipeThumb