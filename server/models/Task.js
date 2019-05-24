const mongoose = require('mongoose')
mongoose.connect(process.env.DB_PATH, {useNewUrlParser: true})
const Schema = mongoose.Schema
const taskSchema = new Schema({
    todo_id     : { type: Schema.Types.ObjectId, ref: 'Todos' },
    task_name   : String,
    task_desc   : String,
    task_status : Boolean,
})
const Task = mongoose.model('Tasks', taskSchema)

module.exports = Task