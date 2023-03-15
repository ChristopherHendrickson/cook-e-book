const express = require('express')
const router = express.Router()
const cors = require('cors')
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

let counting = false

router.get('/api/internal/wakeup', cors(), async(req,res,next)=>{
    console.log('test')
    res.status(200).json("Woken")
    if (!counting) {
        counting = true
        setTimeout(async () => {
            counting = false
            const res = await fetch('https://cookebook.onrender.com/api/internal/wakeup')
        }, 100000);
    }
})

module.exports = router
