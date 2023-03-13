import { useState, useContext, useEffect } from 'react';

import { SavedRecipesContext } from '../context/savedRecipesContext'
import { CustomTagsContext } from '../context/CustomTagsContext';

import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import Tags from './Tags'
import remove from '../assets/remove.png'
import Form from 'react-bootstrap/Form';    

const EditRecipe = ({ recipe, handleClose } ) => {
    
    const ingredientFormSchema = {
        ingName:'',
        quantity:'',
        unit:'',
        raw_text:''
    }
    
    const [savedRecipes, setSavedRecipes] = useContext(SavedRecipesContext)
    const [customTags,setCustomTags] = useContext(CustomTagsContext)
    const [tags,setTags] = useState([])
    const [ingredients,setIngredients] = useState([{...ingredientFormSchema},{...ingredientFormSchema},{...ingredientFormSchema}])
    const [instructions,setInstructions] = useState(['','',''])
    const [genericFields,setGenericFields] = useState({recipeName:'',servings:'',customTag:''})

    const [saveButtonText,setSaveButtonText] = useState('Save')
    const [saveButtonDisable,setSaveButtonDisable] = useState(false)

    const handleCleanUp = () => {
        setTags([])
        setIngredients([{...ingredientFormSchema},{...ingredientFormSchema},{...ingredientFormSchema}])
        setInstructions(['','',''])
        setGenericFields({recipeName:'',servings:'',customTag:''})
        setSaveButtonDisable(false)
        setSaveButtonText('Save')
        handleClose()
    }

    useEffect(()=>{
        if (recipe?._id) {

            setTags(recipe.tags)
            const recipeComponents = recipe.components.map((c)=>{
                return {
                    ingName: c.ingredient.name,
                    raw_text: c.raw_text,
                    quantity: c.measurement.quantity,
                    unit: c.measurement.unitAbbreviation
                }
            })
            setIngredients(recipeComponents)
            setInstructions(recipe.instructions)
            setGenericFields({recipeName:recipe.name,servings:recipe.numServings,customTag:''})
        }

    },[recipe])
    
    const addCustomTag = () => {

        if (genericFields.customTag) {
            const newTagsList = [...customTags]
            const includedTagOptionNames = customTags.map((tag)=>{
                return tag.display_name.toLowerCase()
            })
            if (!includedTagOptionNames.includes(genericFields.customTag.toLowerCase())) {
                newTagsList.push({
                    id:0,
                    type:'custom',
                    name: genericFields.customTag.replace(' ','_'),
                    display_name: genericFields.customTag
                })
                setCustomTags(newTagsList)
            }
            setGenericFields({
                ...genericFields,
                'customTag':''
            })
        }
    }

    const handleIngredientFormChange = (event,index) => {
        setSaveButtonDisable(false)
        setSaveButtonText('Save')
        const { name, value } = event.target
        const newIngredients = [...ingredients]

        const updatedIngredient = {...ingredients[index]}

        updatedIngredient[name] = value
        
        const textFields = [updatedIngredient.quantity, updatedIngredient.unit, updatedIngredient.ingName].filter((field)=>{
            return field
        })

        const generatedRawText = textFields.join(' ')

        newIngredients[index][name] = value
        newIngredients[index].raw_text = generatedRawText
        setIngredients(newIngredients)
    }

    const addIngredientRow = () => {
        setIngredients([...ingredients,{...ingredientFormSchema}])
    }

    const removeIngredientRow = (index) => {
        const newIngredients = [...ingredients]
        newIngredients.splice(index,1)
        setIngredients(newIngredients)
    }

    const handleInstructionFormChange = (event,index) => {
        setSaveButtonDisable(false)
        setSaveButtonText('Save')
        const newInstructions = [...instructions]
        newInstructions[index] = event.target.value
        setInstructions(newInstructions)

        //dynamic textarea size update
        const textarea = event.target;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    const addInstructionRow = () => {
        setInstructions([...instructions,''])
    }

    const removeInstructionRow = (index) => {
        const newInstructions = [...instructions]
        newInstructions.splice(index,1)
        setInstructions(newInstructions)
    }

    const handleGenericChange = (event) =>{
        setSaveButtonDisable(false)
        setSaveButtonText('Save')
        const { name, value } = event.target
        if (name == 'servings' && !(value > 0 || value=='')) {
            return
        }
        setGenericFields({
            ...genericFields,
            [name]: value
        })
    }

    const handleSubmit = async (event) => {

        const componentsFormatted = () => {
            const components = ingredients.map((i)=>{

                const ingredient = {
                    name: i.ingName,
                    displaySingular: i.ingName,
                    displayPlural: i.ingName+'s',
                }
                const measurement = {
                    quantity: i.quantity || '0',
                    unit: i.unit,
                    unitAbbreviation: i.unit
                }

                return {
                    raw_text:i.raw_text,
                    ingredient: ingredient,
                    measurement: measurement
                }
            })
            return components
        }

        const instructionsFiltered = () => {
            return instructions.filter((instruction)=>{
                return instruction
            })
        }

        const validateRecipeBody = (body) => {

            const fieldValidities = []
            const allIngredientsHaveName = body.components.every((com)=>com.ingredient.name)

            fieldValidities.push({
                valid:!!body.name,
                message:'You must name your recipe'
            })
            fieldValidities.push({
                valid:allIngredientsHaveName,
                message:'All ingredients must have a name, please remove any un-used rows'
            })

            let allValid = true
            const errorMessages = []

            fieldValidities.forEach((field)=>{
                if (!field.valid) {
                    allValid=false
                    errorMessages.push(field.message)
                }
            })

            return {
                valid:allValid,
                messages:errorMessages
            }
        }

        const httpRequestHandler = async (body,url,method) => {
            
            const bodyValidity = validateRecipeBody(body)

            if (bodyValidity.valid) {
                setSaveButtonText('Saving...')
                setSaveButtonDisable(true)
                const res = await fetch(url,{
                    method: method,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }) 
                if (res.status == 200) {
                    const newlySavedRecipe = await res.json()
                    if (method == 'POST') {
                        setSavedRecipes([...savedRecipes,newlySavedRecipe])
                    } else if (method == 'PUT') {
                        const newSavedRecipesState = savedRecipes.map((r)=>{
                            if (r._id.toString() == recipe._id.toString()) {
                                return newlySavedRecipe
                            } else {
                                return r
                            }
                        })
                        setSavedRecipes(newSavedRecipesState)
                    }

                    setSaveButtonText('Saved ✓')
                } else {
                    setSaveButtonText('Error Saving')
                    setSaveButtonDisable(false)
                }
            } else {
                bodyValidity.messages.forEach((message)=>{
                    toast.error(message)
                })
                setSaveButtonText('Save')
                setSaveButtonDisable(false)
            }
        }

        const handlePutRequest = () => {
            const url = `/api/internal/recipes/${recipe._id}`
            const method = 'PUT'
            const body = {
                name: genericFields.recipeName,
                apiID: recipe.apiID,
                components: componentsFormatted(),
                instructions: instructionsFiltered(),
                favourite: recipe.favourite,
                active: recipe.active,
                tags: tags,
                totalPrepTime: recipe.totalPrepTime,
                numServings: genericFields.servings,
                ThumbnailURL: recipe.ThumbnailURL
            }
            httpRequestHandler(body,url,method)
        }

        const handlePostRequest = async () => {
            const url = '/api/internal/recipes'
            const method = 'POST'
            const body = {
                name: genericFields.recipeName,
                apiID: null,
                components: componentsFormatted(),
                instructions: instructionsFiltered(),
                favourite: false,
                active: true,
                tags: tags,
                totalPrepTime: null,
                numServings: genericFields.servings,
                ThumbnailURL: null
            }
            httpRequestHandler(body,url,method)
        }


        event.preventDefault()
        if (recipe._id) {
            handlePutRequest()
        } else {
            handlePostRequest()
        }
        
    }

    const handleTagToggle = ( tag ) => {
        let removed = false
        const newTags = tags.filter((t)=>{
            if (t.name == tag.name) {
                removed=true
                return false
            } 
            return true
        })
        
        if (!removed) {
            newTags.push(tag)
        }
        setTags(newTags)
    }


    if (!recipe) {
        return 
    }
    return (
        <Modal 
            show={recipe}
            onHide={handleCleanUp}
            size="xl"
            >
            <Modal.Header closeButton >
            <Modal.Title >
                Recipe Editor
            </Modal.Title>
            
            </Modal.Header >
            <Modal.Body>
                <Form  onSubmit={event=>event.preventDefault()}>
                <div className='modal-top'>
                    <div className='w-100 flex-col w-max-80'>
                    <label htmlFor='recipeName'><h4>Name</h4></label>
                    <input className='input-text w-100 marg-10 bold' autoComplete='off' type='text' name='recipeName' placeholder='Name' value={genericFields.recipeName} onChange={handleGenericChange}></input>
                    </div>
                    <div className='w-100 flex-col w-max-30 flex-right'>
                    <label htmlFor='servings'>Serves</label>
                    <input className='input-text narrow marg-10' autoComplete='off' name='servings' value={genericFields.servings} onChange={handleGenericChange} type='number' alt='Servings' min='1'></input>
                    </div>
                </div>

                <div className='modal-main'>

                    <div className='modal-main-left'>
                        <h4>Tags</h4>
                        <Tags selectedTags={tags} onClick={handleTagToggle}></Tags>
                        <label htmlFor='customTag'>Add your own tags</label>

                        <input className='input-text marg-10' name='customTag' value={genericFields.customTag} onChange={handleGenericChange} type='text' alt='custom tag' ></input>
                        <button type="button" className='btn-default narrow' onClick={addCustomTag}>Add</button>
                        
                    </div>
                    <div className='modal-main-right'>
                    <h4>Ingredients</h4>
                        <table className='edit-table'>
                            <thead>
                                <tr>
                                    <th>Ingredient Name</th>
                                    <th>Amount</th>
                                    <th>Unit</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                            {ingredients.map((i,index)=>{
                                return (
                                    <tr key={`i09${index}`}>
                                        <td><input className='input-text' type='text' autoComplete='off' name='ingName' value={i.ingName} onChange={event=>handleIngredientFormChange(event,index)}/></td>
                                        <td><input className='input-text narrow' type='text' autoComplete='off' name='quantity' value={i.quantity} onChange={event=>handleIngredientFormChange(event,index)}/></td>
                                        <td><input className='input-text narrow' type='text' autoComplete='off' name='unit' value={i.unit} onChange={event=>handleIngredientFormChange(event,index)}/></td>
                                        
                                        <td><div className='td-widener'><button type="button" tabIndex="-1" className='btn-icon sm' onClick={()=>removeIngredientRow(index)}><img className='btn-icon-content' src={remove}></img></button></div></td>
                                        
                                    </tr>
                                )
                            })} 
                            </tbody>
                        </table>
                        <button type="button" className='btn-default' onClick={addIngredientRow}>Add More Ingredients</button>
                    </div>

                </div>
                <div className='modal-bottom'>
                    <h4>Method</h4>
                    <table className='edit-table'>
                        <tbody>
                        {instructions.map((instruction,index)=>{
                            return (
                                <tr key={`i08${index}`}>
                                    <td><textarea className='input-text w-100' rows='1' autoComplete='off' name='instructions' value={instruction} placeholder={index+1+'.'} onChange={event=>handleInstructionFormChange(event,index)}/></td>
                                    <td><button tabIndex="-1" type="button" className='btn-icon sm' onClick={()=>removeInstructionRow(index)}><img className='btn-icon-content' src={remove}></img></button></td>
                                </tr>
                            )
                        })} 
                        </tbody>
                    </table>
                    <button className='btn-default' type="button" onClick={addInstructionRow}>Add More Steps</button>
                </div>
                
            </Form>
            </Modal.Body>
            <Modal.Footer>
            <div className='modal-foot'>
                <div className='modal-foot-injects'>
                <button className='btn-default' disabled={saveButtonDisable} onClick={handleSubmit}>{saveButtonText}</button>

                </div>
                <button className="btn-default" onClick={handleCleanUp}>
                    Close
                </button>
            </div>
            </Modal.Footer>
            <ToastContainer
                position="bottom-center"
                autoClose={3000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                pauseOnHover={false}
                theme="light"
            />
        </Modal>
    )
}
export default EditRecipe