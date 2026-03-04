const userModel = require('../models/user.model')

class UserController {
  async search(req, res) {
    const { q } = req.query
    if (!q) return res.error(400, 'Query parameter q is required')

    const user = await userModel.findByEmail(q)
    if (!user) return res.error(400, 'User not found')

    res.success(user)
  }
}

module.exports = new UserController()
