const crypto = require('crypto')
const { secret } = require('../configs/jwt')
const userModel = require('../models/user.model')
const revokedTokenModel = require('../models/revokedToken.model')

async function authRequired(req, res, next) {
  try {
    const accessToken = req.headers.authorization?.replace('Bearer', '').trim()
    if (!accessToken) {
      return res.error(401, 'Unauthorized')
    }

    const tokenExisted = await revokedTokenModel.checkExist(accessToken)
    if (tokenExisted) {
      return res.error(401, 'Unauthorized')
    }

    jwt.verify(accessToken, secret)

    const currentUser = await userModel.findOne(payload.sub)
    if (!currentUser) {
      return res.error(401, 'Unauthorized')
    }

    req.user = currentUser
    req.token = accessToken
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.error(401, 'Token expired')
    }
    return res.error(401, 'Invalid token or Unauthorized')
  }
}

module.exports = authRequired
