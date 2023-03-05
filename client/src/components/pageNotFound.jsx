import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useEffect,useState } from 'react'


const PageNotFound = () => {
    const navigate = useNavigate()
    const location = useLocation().pathname

    const navHome = () => {
        navigate('/cookbook')
    }
    
    return (
        <>
        {location == '/' ? 
        <Navigate to='/cookbook'/> : 
        <>
            <p>Page not found </p>
            <button onClick={navHome}>Take Me Home</button>
        </>
        }
        </>
        
    )
}

export default PageNotFound