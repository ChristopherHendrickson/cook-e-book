import React, { useContext, useState } from 'react'

export const UserContext = React.createContext()


export const UserProvider = ( { children } ) => {
    const [user,setUser] = useState(null)

    const updateUser = (newUser) => {
        setUser(newUser)
    }


    return (
        <UserContext.Provider value={[user, updateUser]}>
                {children}
        </UserContext.Provider>
    )
}

