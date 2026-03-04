const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const { secret } = require('../configs/jwt')

class AuthController {
  async register(req, res) {
    const { email, password } = req.body

    const existingUser = await userModel.findByEmail(email)
    if (existingUser) {
      return res.error(400, 'Email already registered')
    }

    const insertId = await userModel.create(email, password)
    const newUser = { id: insertId, email }
    res.success(newUser, 201)
  }

  async login(req, res) {
    const { email, password } = req.body
    const user = await userModel.findByEmailAndPassword(email, password)
    if (!user) return res.error(401, 'Unauthorized')

    const expiresIn = 60 * 60
    const token = jwt.sign({ sub: user.id }, secret, { expiresIn })

    res.success(user, 200, {
      access_token: token,
      access_token_expire: expiresIn,
    })
  }

  getCurrentUser(req, res) {
    res.success(req.user)
  }
}

module.exports = new AuthController()
