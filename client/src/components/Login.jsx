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
        const res = await fetch("api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fields)
        })
        const data = await res.json()
        if (res.status === 200) {
            setError(null)
            setUser(data)
            navigate('/home')
            setError(data)
        } else if (res.status === 200) {

        }
    }
    return (
        <>    
        <form onSubmit={handleSubmit}>
            { error && <p>{error.message}</p> }
            <label htmlFor="login-username">Name</label>
            <input name="username" type="text" onChange={handleChange} id="login-username" value={fields.username}/>
            <br/>
            <label htmlFor="login-password">Password</label>
            <input name="password" type="password" onChange={handleChange} id="login-password" value={fields.password}/>
            <br/>
            <input type='submit' value='Log in'></input>
        </form>
    <p>Or</p><button onClick={()=>{navigate('/register')}}>Register</button>
    </>

    )

  }
  
export default Login