const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/user')


const authenticate = (req,res,next) => {
  const auth = passport.authenticate('local', (err, user, info) => {
    if (err) {
      next(err)
    }
    if (!user) {
      res.status(401).json({message: 'Incorrect username or password'})
    }
    req.logIn(user, (err) => {
      if (err) next(err)
      next()
    })
  })
  auth(req,res,next)
}

router.post('/api/auth/login', authenticate, (req, res) => {
  res.json(req.user)
})

router.post('/api/auth/logout', (req, res) => {
    const loggedOutUser = req.user
    if (loggedOutUser) {
        req.logout(() => {
            res.json({
                message:'Successfully Logged out',
                user:loggedOutUser
            })
        })
    } else {
        res.json({
            message:'No Logged In User',
            user:null
        })
    }
})


router.get('/api/auth/loggedinuser', (req,res) => {
  if (req.user) {
    
    res.json(req.user)
  } else {
    res.status(404).json({ msg: 'User not logged in' })
  }
})


router.post('/api/auth/register', async (req,res)=>{
  const {username, password, confirmPassword} = req.body
  if (password !== confirmPassword) {
    return res.status(400).json({message: "Passwords do not match"})
  }
  try {
      const user = await User.register(    
          new User({
            username:username,              
          }),
          password
      )

      req.login(user, () => {
          res.status(201).json(user) 
      })
  } catch (error) {
      res.status(403).json(error)
  }
})


module.exports = router
