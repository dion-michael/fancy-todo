const router = require('express').Router()
const todoController = require('../controllers/todoController.js')
const Authenticate = require('../middleware/authenticate')

router.get('/', Authenticate, todoController.getAllTodos)
router.post('/', Authenticate, todoController.create)
router.delete('/:todoId', Authenticate, todoController.delete)

module.exports = router