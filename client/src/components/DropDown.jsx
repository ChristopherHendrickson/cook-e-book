import { useState } from 'react'

const DropDown = ({ children, title }) => {
    
    const [showComponent,setShowComponent] = useState(false)

    const toggleReveal = () => {
        setShowComponent(!showComponent)
    }

    return (
        <div className={`drop-down${showComponent ? ' shown' : ''}`}>
            <button className={`drop-down-btn${showComponent ? ' shown' : ''}`} onClick={toggleReveal}>{title}</button>
            {showComponent &&
                <div className='drop-down-content'>
                    {children}
                </div>
            }
        </div>
    )
}

export default DropDown