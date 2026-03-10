const authController = require('../controllers/auth.controller')
const authRequired = require('../middlewares/authRequire')

const router = require('express').Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/refresh-token', authController.refreshToken)
router.post('/logout', authRequired, authController.logout)
router.get('/me', authRequired, authController.getCurrentUser)

module.exports = router
