import { useContext } from 'react'
import { UserContext } from '../context/userContext'

const Loader = ({ children }) => {
    const [ user, setUser ] = useContext(UserContext)

    if (!user) {
        return (
            <>
                Loading...
            </>
        )
    } else {
        return children
    }


}

export default Loader