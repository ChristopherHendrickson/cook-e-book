

const LoaderThumbsMealPlan = () => {

    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

    return (
        <ul className='meal-plan-ui'>
                <button className='btn-icon med'></button>

                    {days.map((day)=>{
                        return (
                        <li key={`loader-mp-${day}`}className='meal-plan-day'>
                            <div className='mp-1'>
                                <div className='day-title shadow-text'>{day}</div>
           
                            </div>
                            <div className='mp-2'>
                                    <h4 className='meal-title shadow-text'>Southern Style Pork Belly</h4>
                                <div className='meal-plan-btns-container'>
                                    <button className='btn-icon sm shadow-text'>@</button>
                                    <button className='btn-icon sm shadow-text'>X</button>
                                </div>
                            </div>
                        </li>   
                        )
                    })}
                    
            </ul>
    )
}

export default LoaderThumbsMealPlan