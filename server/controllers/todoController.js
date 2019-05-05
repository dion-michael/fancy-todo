const Todo = require('../models/Todo.js')
const Task = require('../models/Task.js')
const User = require('../models/User')
const mongoose = require('mongoose')
const dateFormat = require('dateformat')
var ObjectId = mongoose.Schema.Types.ObjectId;

class todoController {

    static getAllTodos(req, res){
        Todo.find({})
        .populate('tasks')
        .populate('user_id')
        .then(dataAll => {
            res.status(200).json(dataAll)
        }).catch(err => {
            res.status(500).json(err)
        })
    }

    static create(req, res){
        let arrOfPromises = []
        let arrOfTaskId = []
        let tasks = JSON.parse(req.body.tasks)
        if(req.body.tasks){
            tasks.forEach(task => {
                task = new Task({
                    task_name: task,
                    task_status: false
                })
                arrOfTaskId.push(mongoose.Types.ObjectId(task.id))
                arrOfPromises.push(task.save())
            })
        }

        let todo = new Todo({
            createdAt   : new Date(),
            user_id     : mongoose.Types.ObjectId(req.loggedUser.id),
            title       : req.body.title,
            status      : false,
            deadline    : req.body.deadline,
            tasks       : arrOfTaskId
        })

        User.findById(req.loggedUser.id)
        .then(user => {
            user.todos.push(todo.id)
            arrOfPromises.push(user.save())
        }).catch(err => {
            res.status(500).json(err)
        })
        
        todo.save()
        .then(savedData => {
            Promise.all(arrOfPromises)
            .then(arrOfSavedData => {
                res.status(200).json(savedData)
            }).catch(err => {
                res.status(500).json(err)
            })
        }).catch(err => {
            res.status(500).json(err)
        })
    }

    static delete(req, res){
        let id = req.params.todoId
        let arr = []
        
        User.findById(req.loggedUser.id)
        .then(userData => {
            userData.todos.forEach((todo, x) => {
                if(todo.toString() === id){
                    userData.todos.splice(x, 1)
                }
            })
            userData.save().then(savedData => {

            })
        })
        Todo.findById(id)
        .then(todoData => {
            todoData.tasks.forEach(task => {
                Task.findByIdAndDelete(task)
                .then(task1 => {
                })
            })
        })
        arr.push(Todo.findByIdAndDelete(id))
        Promise.all(arr)
        .then(deletedDatas => {
            res.status(200).json(deletedDatas)
        })
    }

}

module.exports = todoController