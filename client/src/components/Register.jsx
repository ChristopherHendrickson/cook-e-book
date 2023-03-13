import { useState, useContext } from 'react'
import { useNavigate } from "react-router-dom"
import { UserContext } from '../context/userContext'


const initialState = {username:'',password:'',confirmPassword:''}
const Register = () => {
    const [ user, setUser ] = useContext(UserContext)

    const [fields, setFields] = useState(initialState)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleChange = (event) => {
        const { name, value } = event.target
        setFields({
          ...fields,
          [name]: value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fields)
        })
        const data = await res.json()
        if (res.status === 201) {
            setError(null)
            setUser(data)
            navigate('/')
        } else {
            setError(data)
            setFields({username:fields.username,password:'',confirmPassword:''})
        }
    }
    return (
        <div className='lander-page'>
            <div className='lander-panel'>
                <h2>Create your account</h2>
                <form className='lander-form' onSubmit={handleSubmit}>
                    { error && <p>{error.message}</p> }

                    <label htmlFor="register-username">Name</label>
                    <input className='input-text marg-10' name="username" type="text" onChange={handleChange} id="register-username" value={fields.username}/>
                    <label htmlFor="register-password">Password</label>
                    <input className='input-text marg-10' name="password" type="password" onChange={handleChange} id="register-password" value={fields.password}/>
                    <label htmlFor="register-confirmPassword">Confirm Password</label>
                    <input className='input-text marg-10' name="confirmPassword" type="password" onChange={handleChange} id="register-confirmPassword" value={fields.confirmPassword}/>
                    <input className='btn-default' type='submit' value='Register'></input>
                </form>
                <span>Have an account?</span>
                <button className='btn-default' onClick={()=>{navigate('/login')}}>Go to log in</button>
            </div>  
        </div>
    
    )

  }
  
export default Register