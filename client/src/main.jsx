import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import { UserProvider } from './context/userContext'
import { SavedRecipeProvider } from './context/savedRecipesContext'
import { MealplanProvider } from './context/MealplanContext'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <UserProvider>
        <SavedRecipeProvider>
          <MealplanProvider>
			      <App/>
          </MealplanProvider>
        </SavedRecipeProvider>
      </UserProvider>
		</Router>
  </React.StrictMode>
);