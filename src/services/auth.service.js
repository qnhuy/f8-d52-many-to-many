const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userModel = require('../models/user.model')
const { secret } = require('../configs/jwt')
const { TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES } = require('../constants')
const { createRandomString } = require('../utils/string')
const saltRounds = 10

class AuthService {
  async getTokenInfo(userId) {
    const accessToken = jwt.sign({ sub: userId }, secret, {
      expiresIn: `${TOKEN_EXPIRES}ms`,
    })
    const refreshToken = createRandomString()
    const refreshExpires = new Date(Date.now() + REFRESH_TOKEN_EXPIRES)

    await userModel.updateRefreshToken(userId, refreshToken, refreshExpires)

    return {
      access_token: accessToken,
      access_token_expires: TOKEN_EXPIRES,
      refresh_token: refreshToken,
      refresh_token_expires: REFRESH_TOKEN_EXPIRES,
    }
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, saltRounds)
  }

  async comparePassword(data, encrypted) {
    return await bcrypt.compare(data, encrypted)
  }
}

module.exports = new AuthService()
