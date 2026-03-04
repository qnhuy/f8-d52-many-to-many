const router = require('express').Router()
const authRouter = require('./auth.route')
const conversationRouter = require('./conversation.route')
const userRouter = require('./user.route')

router.use('/auth', authRouter)
router.use('/conversations', conversationRouter)
router.use('/users', userRouter)

module.exports = router
