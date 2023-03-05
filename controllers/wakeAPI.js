const express = require('express')
const router = express.Router()
const cors = require('cors')

// The purpose of this is to provide an endpoint I can continuously request to prevent my app from sleeping when it is hosted on free tiers :)
// I have a clock on my portfolio website sending requests in 15 minute intervals (sleep period of render)
router.get('/api/internal/wakeup', cors(), async(req,res,next)=>{
    res.status(200).json("Woken")
})
 module.exports = router