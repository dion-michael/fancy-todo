const User = require('../models/User.js')
const jwt = require('jsonwebtoken')
const generatePassword = require('../helpers/passwordGenerator.js')
const dateformat = require('dateformat')
const bcrypt = require('bcryptjs')
class userController {

    static getAllUsers(req, res){
        User.find({})
        .populate({
            path: 'todos',
            populate: {
                path: 'tasks'
            }
        })
        .then(allUsers => {
            res.status(200).json(allUsers)
        }).catch(err => {
            res.status(200).json(err)
        })
    }

    static getOne(req, res){
        User.findById(req.loggedUser.id)
        .populate({
            path: 'todos',
            populate: {
                path: 'tasks',
                options: {
                    sort: {
                        createdAt : -1
                    }
                }
            }
        })
        .then(found => {
            if(found){
                found.todos.forEach(todo => {
                    console.log(dateformat(todo.createdAt, 'fullDate'))
                    todo.createdAt = dateformat(todo.createdAt, "fullDate")
                    console.log(todo.createdAt)
                })
                console.log(found)
                res.status(200).json(found)
            }else{
                res.status(404).json({
                    msg: "not found"
                })
            }
        }).catch(err => {
            res.status(500).json(err)
        })
    }

    static create(req, res, next){
        let pwd = generatePassword()
        console.log(req.body.isGoogle, '11111111')
        if(req.body.isGoogle === 'false'){ pwd =  req.body.password}
        console.log(pwd, '2222222222222')
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            password: pwd,
            todos: []
        })
        // console.log(user)
        user.save()
        .then(success => {
            next()
        }).catch(err => {
            res.status(500).json(err)
        })
    }

    static signIn(req, res){
        console.log('masuk')
        const {OAuth2Client} = require('google-auth-library');
        const client = new OAuth2Client(process.env.CLIENT_ID);
        client.verifyIdToken({
            idToken: req.headers.id_token,
            audience: process.env.CLIENT_ID
        })
        .then(ticket => {
            let payload = ticket.getPayload()
            let userid = payload['sub']
            User.findOne({
                email: payload.email
            })
            .then(found => {
                if(found){
                    console.log(found, '12121212121212')
                    return found
                }else{
                    let user = new User({
                        name: payload.name,
                        email: payload.email,
                        password: generatePassword(),
                        todos: [],
                        picture: payload.picture
                    })
                    return user.save()
                }
            }).then((userData) => {
                console.log(userData, '123456789098765432')
                console.log(process.env.JWT_SECRET)
                let token = jwt.sign({
                    id: userData.id,
                    name: userData.name
                }, process.env.JWT_SECRET)
                console.log(token, 'xxxxxxxxxxxxx')
                res.status(200).json({
                    token,
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    picture: userData.picture,
                    todos: userData.todos
                })
            }).catch(err => {
                res.status(500).json(err)
            })
        }).catch(err => {
            res.status(500).json(err)
        })

    }

    static emailSignIn(req, res){
        console.log('masuk', '11111111111111111')
        User.findOne({
            email: req.body.email
        }).then(user => {
            console.log(req.body.password)
            console.log(user.password)
            let isValid = bcrypt.compareSync(req.body.password, user.password)
            if(isValid){
                let token = jwt.sign({
                    id: user.id,
                    name: user.name
                }, process.env.JWT_SECRET)
                console.log(token, 'xxxxxxxxxxxxx')
                res.status(200).json({
                    token,
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    picture: user.picture,
                    todos: user.todos
                })
            }else{
                console.log('fail')
                res.status(403).json({
                    msg: 'invalid password'
                })
            }
        })
    }

}

module.exports = userController