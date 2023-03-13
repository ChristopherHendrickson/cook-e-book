import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import { UserProvider } from './context/userContext'
import { SavedRecipeProvider } from './context/savedRecipesContext'
import { MealplanProvider } from './context/MealplanContext'
import { CustomTagsProvider } from './context/CustomTagsContext'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <UserProvider>
        <SavedRecipeProvider>
          <MealplanProvider>
            <CustomTagsProvider>
			        <App/>
            </CustomTagsProvider>
          </MealplanProvider>
        </SavedRecipeProvider>
      </UserProvider>
		</Router>
  </React.StrictMode>
);