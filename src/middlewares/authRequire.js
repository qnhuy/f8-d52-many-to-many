const jwt = require('jsonwebtoken')
const { secret } = require('../configs/jwt')
const userModel = require('../models/user.model')

async function authRequired(req, res, next) {
  try {
    const accessToken = req.headers.authorization?.replace('Bearer', '').trim()
    if (!accessToken) {
      return res.error(401, 'Unauthorized')
    }

    const payload = jwt.verify(accessToken, secret)

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return res.error(401, 'Token expired')
    }

    const currentUser = await userModel.findOne(payload.sub)
    if (!currentUser) {
      return res.error(401, 'Unauthorized')
    }

    req.user = currentUser
    next()
  } catch (error) {
    return res.error(401, 'Invalid token')
  }
}

module.exports = authRequired
