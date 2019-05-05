const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    if(req.headers.hasOwnProperty('token')){
        const decode = jwt.verify(req.headers.token, process.env.JWT_SECRET)
        req.loggedUser = decode
        console.log(req.loggedUser)
        next()
    }
    else{
        res.status(401).json({
            msg: 'you have to login first'
        })
    }
}