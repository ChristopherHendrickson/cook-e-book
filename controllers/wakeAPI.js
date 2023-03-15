const express = require('express')
const router = express.Router()
const cors = require('cors')
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

let counting = false

router.post('/api/internal/wakeup', cors(), async(req,res,next)=>{
    res.status(200).json("Woken")
    if (req.body.return_URL && !counting) {
        counting = true
        setTimeout(async () => {
            counting = false
            await fetch(req.body.return_URL)            
        }, 600000);
    }
})
module.exports = router
