class ShoppingListGenerator {
    static generate(mealPlan) {

        const titleCase = (str) => {
            const splitStr = str.split(' ')
            const titled = splitStr.map((word)=>{
                return word.slice(0,1).toUpperCase()+word.slice(1)
            })
            const newStr = titled.join(' ')
            return newStr.trim()
        }

        const shoppingList = []
        const seenIngredients = []
        const recipeList = Object.keys(mealPlan.recipes).map((day)=>{
            return mealPlan.recipes[day]
        })
    
        recipeList.forEach((recipe)=>{
            if (recipe) {
                recipe.components.forEach((component)=>{
                    const ingredientName = titleCase(component.ingredient.name)
                    const ingredientUnit = component.measurement.unitAbbreviation
                    const ingredientQuantity = component.measurement.quantity
        
                    if (seenIngredients.includes(ingredientName)) {
        
                        const ingredientEntryOfSameName = shoppingList.find((ingred)=>{
                            return ingred.name == ingredientName
                        })
                        const quantityEntryOfSameUnit = ingredientEntryOfSameName.quantities.find((ingred)=> {
                            return ingred.unit == ingredientUnit
                        })
                        
                        if (quantityEntryOfSameUnit) {
                            quantityEntryOfSameUnit.quantity = String(Number(quantityEntryOfSameUnit.quantity) + Number(ingredientQuantity) || quantityEntryOfSameUnit.quantity + ` ${ingredientQuantity}`)
                            if (quantityEntryOfSameUnit.quantity == '0 0') {
                                quantityEntryOfSameUnit.quantity = '0'
                            }
                        } else {
                            ingredientEntryOfSameName.quantities.push({
                                quantity:ingredientQuantity,
                                unit:ingredientUnit
                            })
                        }
                        
                    } else {
                        shoppingList.push({
                            name:ingredientName,
                            quantities:[{
                                quantity:ingredientQuantity,
                                unit:ingredientUnit
                            }],
                            gotten:false
                        })
                        seenIngredients.push(ingredientName)
                    }
                })
            }
        })
        mealPlan.shoppingList = shoppingList
    }
}

module.exports = ShoppingListGenerator