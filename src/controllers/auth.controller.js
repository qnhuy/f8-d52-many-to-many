const revokedTokenModel = require('../models/revokedToken.model')
const userModel = require('../models/user.model')
const authService = require('../services/auth.service')

class AuthController {
  async register(req, res) {
    const { email, password } = req.body

    const userExisted = await userModel.findByEmail(email)
    if (userExisted) {
      return res.error(400, 'Email already registered')
    }

    const hashedPassword = await authService.hashPassword(password)
    const userId = await userModel.create(email, hashedPassword)
    const tokenInfo = await authService.getTokenInfo(userId)

    res.success({ id: userId, email }, 201, tokenInfo)
  }

  async login(req, res) {
    const { email, password } = req.body

    const user = await userModel.findByEmail(email)
    if (!user) {
      return res.error(401, 'Unauthorized')
    }

    const isValid = await authService.comparePassword(password, user.password)
    if (!isValid) {
      return res.error(401, 'Unauthorized')
    }

    const tokenInfo = await authService.getTokenInfo(user.id)
    res.success(user, 200, tokenInfo)
  }

  async refreshToken(req, res) {
    const oldToken = req.body.refresh_token
    if (!oldToken) {
      return res.error(400, 'Refresh token is required')
    }

    const user = await userModel.findByRefreshToken(oldToken)
    if (!user) {
      return res.error(401, 'Unauthorized')
    }

    const tokenInfo = await authService.getTokenInfo(user.id)
    res.success(tokenInfo)
  }

  async logout(req, res) {
    const { token } = req
    if (!token) {
      return res.error(401, 'Unauthorized')
    }

    await revokedTokenModel.create(token)
    res.success(token)
  }

  getCurrentUser(req, res) {
    res.success(req.user)
  }
}

module.exports = new AuthController()
