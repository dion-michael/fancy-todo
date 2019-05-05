const router = require('express').Router()
const Authenticate = require('../middleware/authenticate')
const taskController = require('../controllers/taskController.js')

router.get('/', Authenticate, taskController.getAllTasks)
router.post('/', Authenticate, taskController.create)

module.exports = router