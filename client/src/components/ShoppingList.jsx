import { useState, useEffect, useContext } from 'react'

import { MealplanContext } from '../context/MealplanContext'

import Loader from './Loader'
import TopNav from './TopNav'
import ShoppingListTable from './ShoppingListTable'
import BackToTop from './BackToTop'


const ShoppingList = () => {
    
    const [mealplan, setMealplan] = useContext(MealplanContext)
    const [shoppingList,setShoppingList] = useState(null)
    
    useEffect(()=>{
        if (mealplan) {
            setShoppingList(mealplan.shoppingList)
        }
    },[mealplan])

    return (
        <Loader>
            <>
            <TopNav currentPage={'Shopping List'}/>
            <div className='page-content shopping-list'>
                <h1>Shopping List</h1>
                {shoppingList && 
                    <ShoppingListTable shoppingList={shoppingList} setShoppingList={setShoppingList}/>
                }

            </div>
            </>
            <BackToTop/>
        </Loader>
    )
}

export default ShoppingList