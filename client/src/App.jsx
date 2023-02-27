import { Routes, Route } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from './context/userContext'

import PrivateRoute from './components/PrivateRoute'
import Home from "./components/home"
import Login from "./components/Login"
import Register from "./components/Register"
import PageNotFound from "./components/pageNotFound"
import Loader from './components/Loader'
import Browse from './components/Browse'


function App() {

  const [ user, setUser ] = useContext(UserContext)
  const [ userFetched, setUserFetched] = useState(false)
  useEffect( () => {

    const getUser = async () => {
        const res = await fetch('/api/auth/loggedinuser')
        const user = await res.json()
        if (res.status===200) {
          setUser(user)
        } else {
          setUser(null)
        }
        setUserFetched(true)
      }
      getUser()
  },[])
  
  return (
    <div className="App">
      
        <Routes>
          <Route path = '/login' element={<Login />} />
          <Route path = '/register' element={<Register />} />
          <Route path = '/home' element={<PrivateRoute userFetched={userFetched}><Home/></PrivateRoute>} />
          <Route path = '/browse' element={<PrivateRoute userFetched={userFetched}><Browse/></PrivateRoute>} />
          <Route path = '/meal-plan' element={<PrivateRoute userFetched={userFetched}><Home/></PrivateRoute>} />
          <Route path = '/shopping-list' element={<PrivateRoute userFetched={userFetched}><Home/></PrivateRoute>} />
          <Route path="*" element={<PageNotFound/>} /> 
        </Routes>

    </div>
  )
}

export default App
