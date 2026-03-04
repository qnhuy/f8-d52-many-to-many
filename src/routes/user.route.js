const router = require('express').Router()
const userController = require('../controllers/user.controller')

router.get('/search', userController.search)

module.exports = router
