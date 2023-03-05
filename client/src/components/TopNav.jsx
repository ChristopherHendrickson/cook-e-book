import { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { UserContext, } from '../context/userContext'
import NavPoints from './NavPoints'


const TopNav = ( {currentPage} ) => {
    const [user, setUser] = useContext(UserContext)

    const navigate = useNavigate()
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
                <p>{user?.username}</p>
                <button onClick={logout}>. Logout</button>
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