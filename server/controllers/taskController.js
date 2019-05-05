const Task = require('../models/Task.js')
class todoController {

    static getAllTasks(req, res){
        task.find({})
        .then(dataAll => {
            res.status(200).json(dataAll)
        }).catch(err => {
            res.status(500).json(err)
        })
    }

    static create(req, res){
        let task = new Task({
            task_name   : req.body.task_name,
            task_desc   : req.body.task_desc,
            task_status : false,
            todo_id     : req.body.todo_id
        })
        task.save()
        .then(savedData => {
            res.status(200).json(savedData)
        }).catch(err => {
            res.status(500).json(err)
        })
    }
    
}

module.exports = todoController