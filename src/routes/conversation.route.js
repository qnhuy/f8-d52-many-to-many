const router = require('express').Router()
const conversationController = require('../controllers/conversation.controller')
const authRequired = require('../middlewares/authRequire')

router.post('/', authRequired, conversationController.create)
router.get('/', authRequired, conversationController.getUserConversations)
router.post(
  '/:id/participants',
  authRequired,
  conversationController.addNewUser,
)
router.post('/:id/messages', authRequired, conversationController.sendMessage)
router.get(
  '/:id/messages',
  authRequired,
  conversationController.getConversationMessages,
)

module.exports = router
