const errorHandler = (error,req,res,next) => {

    if (error.name=='ValidationError') {
        return res.status(400).json({message:error.message})
    }


    res.status(500).json({
        message:error.message,
    })
}



module.exports = {
    errorHandler
}