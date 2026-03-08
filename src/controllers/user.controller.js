const userModel = require('../models/user.model')

class UserController {
  async search(req, res) {
    const { q } = req.query
    const { user } = req
    if (!q) return res.success([])

    const users = await userModel.searchByEmail(q, user.id)
    res.success(users)
  }
}

module.exports = new UserController()
