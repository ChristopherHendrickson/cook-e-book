import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useEffect,useState } from 'react'


const PageNotFound = () => {
    const navigate = useNavigate()
    const location = useLocation().pathname

    const navHome = () => {
        navigate('/home')
    }





    return (
        <>
        {location == '/' ? 
        <Navigate to='/home'/> : 
        <>
            <p>Page not found @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@</p>
            <button onClick={navHome}>Take Me Home</button>
        </>
        }
        </>
        
    )
}

export default PageNotFound