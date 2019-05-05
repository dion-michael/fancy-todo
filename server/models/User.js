const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
mongoose.connect('mongodb://localhost/flatodo', {useNewUrlParser: true})
const Schema = mongoose.Schema
const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    todos: [{ type: Schema.Types.ObjectId, ref: 'Todos' }],
    picture: String
})

userSchema.pre('save', function (next) {
    console.log(this, '===========')
    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(this.password, salt)
    console.log(hash)
    this.password = hash
    next()
})
const User = mongoose.model('Users', userSchema)

module.exports = User