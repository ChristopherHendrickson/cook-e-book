import { useContext } from 'react'
import { UserContext } from '../context/userContext'
import TopNav from './TopNav'

const Loader = ({ children }) => {
    const [ user, setUser ] = useContext(UserContext)

    if (!user) {
        return (
                <></>
        )
    } else {
        return children
    }


}

export default Loader