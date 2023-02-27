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
        const res = await fetch("api/auth/register", {
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
    <form onSubmit={handleSubmit}>
        { error && <p>{error.message}</p> }
        <div>
            <label htmlFor="register-username">Name</label>
            <input name="username" type="text" onChange={handleChange} id="register-username" value={fields.username}/>
        </div>
        <div>
            <label htmlFor="register-password">Password</label>
            <input name="password" type="password" onChange={handleChange} id="register-password" value={fields.password}/>
        </div>
        <div>
            <label htmlFor="register-confirmPassword">Confirm Password</label>
            <input name="confirmPassword" type="password" onChange={handleChange} id="register-confirmPassword" value={fields.confirmPassword}/>
        </div>
        <input type='submit' value='Register'></input>
    </form>
    )

  }
  
export default Register