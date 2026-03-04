const conversationModel = require('../models/conversation.model')
const messageModel = require('../models/message.model')
const userModel = require('../models/user.model')
const conversationService = require('../services/conversation.service')

class ConversationController {
  async create(req, res) {
    const { name, type, participant_ids } = req.body
    if (!name || !type || !participant_ids || participant_ids.length === 0) {
      return res.error(
        422,
        'Missing required field(s): name, type, participant_ids',
      )
    }

    if (!['group', 'direct'].includes(type)) {
      return res.error(422, 'Invalid: Type must be "group" or "direct"')
    }

    if (typeof participant_ids === 'string') {
      return res.error(422, 'Invalid: participant_ids must be an array')
    }

    const insertId = await conversationModel.create(name, type, participant_ids)
    res.success(insertId, 201)
  }

  async getUserConversations(req, res) {
    const { page, limit } = req.query
    const { user } = req
    const result = await conversationService.paginate(
      page,
      limit,
      conversationModel.findUserConversations,
      conversationModel.countUserConversations,
      { user_id: user.id },
    )

    res.success(result)
  }

  async addNewUser(req, res) {
    const conversationId = req.params.id
    const { user_id } = req.body
    if (!user_id) {
      return res.error(422, 'Missing required field(s): user_id')
    }

    const user = await userModel.findOne(user_id)
    if (!user) {
      return res.error(400, 'Error: User not found')
    }

    const insertId = await conversationModel.addNewUser(conversationId, user_id)
    res.success({ insertId })
  }

  async sendMessage(req, res) {
    const content = String(req.body.content).trim()
    if (!content) {
      return res.error(422, 'Missing required field(s): content')
    }

    const conversationId = req.params.id
    const { user } = req
    const insertId = await messageModel.create(
      conversationId,
      user.id,
      String(content),
    )
    res.success({ insertId })
  }

  async getConversationMessages(req, res) {
    const conversationId = req.params.id
    const { page, limit } = req.query
    const result = await conversationService.paginate(
      page,
      limit,
      messageModel.findAll,
      messageModel.count,
      { conversation_id: conversationId },
    )
    res.success(result)
  }
}

module.exports = new ConversationController()
