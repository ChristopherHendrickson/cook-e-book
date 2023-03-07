
let raceConditions = {}

const ShoppingListTable = ( { shoppingList, setShoppingList }) => {
    

    const toggleGotten = async (ingredient) => {

        if (!raceConditions[ingredient.name]) {

            raceConditions[ingredient.name] = true
            const newShoppingList = shoppingList.map((item)=>{
                if (item.name==ingredient.name) {
                    item.gotten = !item.gotten
                }
                return item
            })
            setShoppingList(newShoppingList)

            await fetch(`/api/internal/toggleIngredientGotten/${ingredient._id.toString()}`, {
                method:'PUT'
            })
            raceConditions[ingredient.name] = false
        }
    }
    
    if (shoppingList.length == 0) {
        return <div>No Ingredients to show</div>
    }

    return (
        <table className='s-list-table'>
            <tbody>
            {shoppingList.map((ingredient,i)=>{
                return (
                    <tr onClick={()=>toggleGotten(ingredient)} key={`ing-f4s${i}`} >
                        <td className={`s-list-item${ingredient.gotten ? ' gotten':''}`}>
                            <div className='s-list-wr'>
                            <div className={`s-list-gen s-list-n${ingredient.gotten ? ' gotten':''}`}>{ingredient.name}</div>
                            <div className={`s-list-qs${ingredient.gotten ? ' gotten':''}`}>
                                {ingredient.quantities.map((q,i)=>{
                                    return (
                                        <div key={`q-f4s${i}`}>
                                        {(q.quantity > 0 || isNaN(q.quantity)) &&
                                            <span className='s-list-q'>
                                                {q.quantity}{' '}{q.unit}
                                            </span>
                                        }
                                        </div>
                                    )
                                })}
                            </div>
                            </div>
                        </td>
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}


export default ShoppingListTable