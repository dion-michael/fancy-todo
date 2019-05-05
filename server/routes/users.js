const router = require('express').Router()
const userController = require('../controllers/userController.js')
const Authenticate = require('../middleware/authenticate')

router.post('/', userController.create, userController.emailSignIn)
router.post('/signIn', userController.signIn)
router.get('/', Authenticate, userController.getAllUsers)
router.get('/:username', Authenticate, userController.getOne)
router.post('/emailSignIn', userController.emailSignIn)

module.exports = router