import { useState } from 'react'

const DropDown = ({ children, title, size }) => {
    
    const [showComponent,setShowComponent] = useState(false)

    const toggleReveal = () => {
        setShowComponent(!showComponent)
    }

    return (
        <div className={`drop-down ${size}${showComponent ? ' shown' : ''}`}>
            <button className={`drop-down-btn${showComponent ? ' shown' : ''}`} onClick={toggleReveal}><span>{title}</span><span className='dropdown-icon'></span></button>
            {showComponent &&
                <div className='drop-down-content'>
                    {children}
                </div>
            }
        </div>
    )
}

export default DropDown