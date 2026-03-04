const router = require('express').Router()
const conversationController = require('../controllers/conversation.controller')
const authRequired = require('../middlewares/authRequire')

router.post('/', conversationController.create)
router.get('/', authRequired, conversationController.getUserConversations)
router.post('/:id/participants', conversationController.addNewUser)
router.post('/:id/messages', authRequired, conversationController.sendMessage)
router.get('/:id/messages', conversationController.getConversationMessages)

module.exports = router
