const router = require('express').Router()

router.use('/todo', require('./todos'))
router.use('/user', require('./users'))
router.use('/task', require('./task'))

module.exports = router