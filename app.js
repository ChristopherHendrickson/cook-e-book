const express = require('express')
const methodOverride = require('method-override')
const session = require('express-session')
const mongoDBSession = require('connect-mongodb-session')
const passport = require('passport')
const path = require('path')

const mongoose = require('mongoose')




const { errorHandler } = require('./middlewares/errorHandlers')

const User = require('./models/user')



const tastyApi = require('./controllers/tastyAPI')
const authApi = require('./controllers/auth')
const dbApi = require('./controllers/dbAPI')
const wakeAPI = require('./controllers/wakeAPI')

const app = express()

require('dotenv').config()
const PORT = process.env.PORT
const dbURL = process.env.MONGODB_URL

const mongoDBStore = mongoDBSession(session)
const sessionStore = new mongoDBStore({
  uri:dbURL,
  collection:'sessions'
})



app.use(express.static(path.join(__dirname, "client", "dist")));
// app.use(express.static('public')) //looking for static files in public folder
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.use(tastyApi)
app.use(authApi)
app.use(dbApi)
app.use(wakeAPI)
app.use(errorHandler)

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});



mongoose.connect(dbURL, ()=>{
  console.log('connected to database')
})

app.listen(PORT, () => {
  console.log('Listening on port', PORT)
})

