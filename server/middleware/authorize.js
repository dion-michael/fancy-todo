const jwt = require('jsonwebtoken')
const Model = require('../models')
const Todos = Model.Todos

module.exports = (req, res, next) => {
    if(req.headers.hasOwnProperty('token')){
        //buat nyari userId
        const decode = jwt.verify(req.headers.token, 'MY_SECRET')
        console.log(decode.id, 'userId------------')
        //ini postId
        console.log(req.params.id, 'postId==========')
        Todos.findByPk(Number(req.params.id))
        .then(found => {
            if(found){
                if(decode.id == found.userId){
                    next()
                }
                else{
                    res.status(401).json({
                        msg: 'not authorized'
                    })
                }
            }
            else{
                res.status(404).json({
                    msg: 'post not found'
                })
            }
        })
    }
    else{
        res.status(401).json({
            msg: 'you have to login first'
        })
    }
}