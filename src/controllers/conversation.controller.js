const conversationModel = require('../models/conversation.model')
const messageModel = require('../models/message.model')
const userModel = require('../models/user.model')
const conversationService = require('../services/conversation.service')

class ConversationController {
  async create(req, res) {
    const { name, type, participant_ids } = req.body
    const { user } = req
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

    const insertId = await conversationModel.create(
      name,
      type,
      participant_ids,
      user.id,
    )

    const newConversation = {
      id: insertId,
      name,
      type,
      createdBy: user.id,
      createAt: new Date().toISOString(),
    }

    res.success(newConversation, 201)
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

    const conversation = await conversationModel.findOne(conversationId)
    if (!conversation) {
      return res.error(404, 'Conversation not found')
    }

    if (conversation.type !== 'group') {
      return res.erorr(400, 'Cannot add participants to a direct conversation')
    }

    const user = await userModel.findOne(user_id)
    if (!user) {
      return res.error(400, 'Error: User not found')
    }

    const isAlreadyMember = await conversationModel.isUserMember(
      conversationId,
      user_id,
    )
    if (isAlreadyMember) {
      return res.error(409, 'User already in conversation')
    }

    await conversationModel.addNewUser(conversationId, user_id)

    res.success({ user_id, joined_at: new Date().toISOString() }, 201)
  }

  async sendMessage(req, res) {
    const content = String(req.body.content).trim()
    if (!content) {
      return res.error(422, 'Missing required field(s): content')
    }

    const conversationId = req.params.id
    const { user } = req

    const isMember = await conversationModel.isUserMember(
      conversationId,
      user.id,
    )
    if (!isMember) {
      return res.error(403, 'Forbidden')
    }

    const insertId = await messageModel.create(
      conversationId,
      user.id,
      String(content),
    )
    res.success(
      {
        id: insertId,
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        created_at: new Date().toISOString(),
      },
      201,
    )
  }

  async getConversationMessages(req, res) {
    const conversationId = req.params.id
    const { page, limit } = req.query
    const { user } = req

    const isMember = await conversationModel.isUserMember(
      conversationId,
      user.id,
    )
    if (!isMember) {
      return res.error(403, 'Forbidden')
    }

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
