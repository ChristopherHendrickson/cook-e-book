const authenticate = (req,res,next) =>{
    if (req.isAuthenticated()) {
        return next()
    } else {
        return res.status(401).json({message: 'Not Authorised'})
    }
}

module.exports = authenticate