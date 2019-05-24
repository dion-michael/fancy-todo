const mongoose = require('mongoose')
mongoose.connect(process.env.DB_PATH, {
    useNewUrlParser: true
})
const Schema = mongoose.Schema
const todoSchema = new Schema({
    user_id     : { type: Schema.Types.ObjectId, ref: 'Users' },
    title       : String,
    status      : Boolean,
    deadline    : Date,
    createdAt   : Date,
    tasks       : [{ type: Schema.Types.ObjectId, ref: 'Tasks' }]
})
const Todo = mongoose.model('Todos', todoSchema)

module.exports = Todo