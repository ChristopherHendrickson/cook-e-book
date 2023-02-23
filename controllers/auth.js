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
      res.status(401).json({msg: 'Incorrect username or password'})
    }
    req.logIn(user, (err) => {
      if (err) next(err)
      next()
    })
  })
  auth(req,res,next)
}

router.post('/login', authenticate, (req, res) => {
  const { id, username } = req.user

  res.json(req.user)
})

router.post('/logout', (req, res) => {
    const loggedOutUser = req.user
    if (loggedOutUser) {
        req.logout(() => {
            res.json({
                msg:'Successfully Logged out',
                user:loggedOutUser
            })
        })
    } else {
        res.json({
            msg:'No Logged In User',
            user:null
        })
    }
})


router.get('/loggedinuser', (req,res) => {
  if (req.user) {

    res.json(req.user)
  } else {
    res.status(404).json({ msg: 'User not logged in' })
  }
})


router.post('/register', async (req,res)=>{
  const {username, password, confirmPassword} = req.body
  if (password !== confirmPassword) {
    res.status(400).json({message: "Passwords do not match"})
  }
  try {
      if (password === confirmPassword) { 
        const user = await User.register(    
            new User({
              username:username,              
            }),
            password
        )

        req.login(user, () => {
            res.json(user) 
        })
      }
  } catch (error) {
      res.status(403).json(error)
  }
})


module.exports = router
