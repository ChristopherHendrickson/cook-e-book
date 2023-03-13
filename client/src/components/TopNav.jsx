import { useContext, useEffect, useState, useCallback } from 'react'
import { useNavigate } from "react-router-dom"
import { UserContext, } from '../context/userContext'
import NavPoints from './NavPoints'


const TopNav = ( {currentPage} ) => {
    const navigate = useNavigate()

    const [user, setUser] = useContext(UserContext)
    const [popupVis,setPopupVis] = useState(false)

    const handleShowMenu = useCallback((event)=>{
        if (event.target.id == 'acc-nav-d') {
            setPopupVis(!popupVis)
        } else {
            setPopupVis(false)
        }
    },[popupVis])

    
    useEffect(()=> {
        window.addEventListener('click',handleShowMenu)
        return () => {
            window.removeEventListener('click',handleShowMenu)
        }
    },[handleShowMenu])

    const logout = async () => {
        await fetch('/api/auth/logout', {
            method:"POST"
        })  
        setUser(null)
        navigate('/login')
    }


    const pages = ['Cookbook','Browse','Meal Plan','Shopping List']

    return ( 
        <>
        <nav>
            <div className='top-bar'>
                <div className='nav-user' >{user?.username}<span id='acc-nav-d' className='dropdown-icon white'></span></div>
                <div className='popup-container'>
                    <div className={`popup under left${popupVis ? ' show' : ''}`}>
                        <button className='btn-list' onClick={logout}>Logout</button>
                    </div>
                </div>
            </div>
            <NavPoints pages={pages} currentPage={currentPage}></NavPoints>

        </nav>

        <div className='nav-dividor-container'>
            <div className='nav-dividor-shape'></div>
        </div>
        </>
    )
  }
  
export default TopNav