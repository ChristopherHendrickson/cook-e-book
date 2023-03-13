import { useState, useContext } from 'react'
import { useNavigate } from "react-router-dom"
import { UserContext } from '../context/userContext'


const initialState = {username:'',password:''}
const Login = () => {
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
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fields)
        })

        if (res.status === 200) {
            const data = await res.json()
            setError(null)
            setUser(data)
            navigate('/cookbook')
        } else if (res.status !== 500) {
            const data = await res.json()
            setError(data)
        } else {
            setError({message:'Sorry, we are experiencing technical difficulties. Please try again later.'})
        }
    }

    return (
        <div className='lander-page'>
            <div className='lander-panel'>
                <h2>Log in to your account</h2>
                <form className='lander-form' onSubmit={handleSubmit}>
                    { error && <p>{error.message}</p> }
                    <label htmlFor="login-username">Name</label>
                    <input className='input-text marg-10' name="username" type="text" onChange={handleChange} id="login-username" value={fields.username}/>
                    <label htmlFor="login-password">Password</label>
                    <input className='input-text marg-10' name="password" type="password" onChange={handleChange} id="login-password" value={fields.password}/>
                    <input className='btn-default' type='submit' value='Log in'></input>
                </form>
                <p>Haven't signed up yet?</p>
                <button className='btn-default' onClick={()=>{navigate('/register')}}>Create an Account</button>
            </div>
        </div>

    )

  }
  
export default Login