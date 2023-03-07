import { Routes, Route } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from './context/userContext'

import PrivateRoute from './components/PrivateRoute'
import Cookbook from "./components/Cookbook"
import Login from "./components/Login"
import Register from "./components/Register"
import PageNotFound from "./components/pageNotFound"
import Loader from './components/Loader'
import Browse from './components/Browse'
import MealPlan from './components/Mealplan'
import 'bootstrap/dist/css/bootstrap.min.css';
import ShoppingList from './components/ShoppingList'
import BackToTop from './components/BackToTop'

function App() {

  const [ user, setUser ] = useContext(UserContext)
  const [ userFetched, setUserFetched] = useState(false)
  useEffect( () => {

    const getUser = async () => {
        const res = await fetch('/api/auth/loggedinuser')
        
        if (res.status===200) {
          const user = await res.json()
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
      <div className='app-width'>
        <Routes>
          <Route path = '/login' element={<Login />} />
          <Route path = '/register' element={<Register />} />
          <Route path = '/cookbook' element={<PrivateRoute userFetched={userFetched}><Cookbook/></PrivateRoute>} />
          <Route path = '/browse' element={<PrivateRoute userFetched={userFetched}><Browse/></PrivateRoute>} />
          <Route path = '/mealplan' element={<PrivateRoute userFetched={userFetched}><MealPlan/></PrivateRoute>} />
          <Route path = '/shoppinglist' element={<PrivateRoute userFetched={userFetched}><ShoppingList/></PrivateRoute>} /> 
          <Route path="*" element={<PageNotFound/>} /> 
        </Routes>
        </div>
    </div>
  )
}

export default App
