class ShoppingListGenerator {
    static generate(mealPlan) {
        // shoppingList:[{
        //     name:String,
        //     quantities:[{
        //         quantity:String,
        //         unit:String
        //     }],
        //     gotten:Boolean
        // }]
        const shoppingList = []
        const seenIngredients = []
    
    
        mealPlan.recipes.forEach((recipe)=>{
            recipe.components.forEach((component)=>{
                const ingredientName = component.ingredient.name
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
        })
        mealPlan.shoppingList = shoppingList
    }
}

module.exports = ShoppingListGenerator