const paginationService = require('./pagination.service')

class ConversationService {
  constructor() {
    paginationService.apply(this)
  }
}

module.exports = new ConversationService()
