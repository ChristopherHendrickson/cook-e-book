import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../context/userContext'

const PrivateRoute = ({ children, userFetched }) => {
  const [ user, setUser ] = useContext(UserContext)

    if (!userFetched || user) {
      return children
    } else {
        return <Navigate to="/login"/>
    }
  }

export default PrivateRoute