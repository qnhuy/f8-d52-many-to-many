const router = require('express').Router()
const userController = require('../controllers/user.controller')
const authRequired = require('../middlewares/authRequire')

router.get('/search', authRequired, userController.search)

module.exports = router
