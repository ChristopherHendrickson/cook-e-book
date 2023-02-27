import { useContext } from 'react'
import { useNavigate } from "react-router-dom"
import { UserContext } from '../context/userContext'



const TopNav = () => {
    const [ user, setUser ] = useContext(UserContext)
    const navigate = useNavigate()
    const logout = async () => {
        await fetch('/api/auth/logout', {
            method:"POST"
        })  
        setUser(null)
        navigate('/login')
    }

    return ( 
        <nav>
            <p>logged in as {user?.username}</p>
            <button onClick={logout}>Logout</button>
        </nav>
    )
  }
  
export default TopNav