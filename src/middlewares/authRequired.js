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

    const [encodedHeader, encodedPayload, clientSignature] =
      accessToken?.split('.') ?? []
    if (!encodedHeader || !encodedPayload || !clientSignature) {
      return res.error(401, 'Invalid token')
    }

    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(`${encodedHeader}.${encodedPayload}`)

    const signature = hmac.digest('base64url')
    if (signature !== clientSignature) {
      return res.error(401, 'Unauthorized')
    }

    const payload = JSON.parse(atob(encodedPayload))
    if (!payload.exp || payload.exp <= Date.now() / 1000) {
      return res.error(401, 'Token expired')
    }
    const currentUser = await userModel.findOne(payload.sub)
    if (!currentUser) {
      return res.error(401, 'Unauthorized')
    }

    req.user = currentUser
    req.token = accessToken
    next()
  } catch (error) {
    return res.error(401, 'Invalid token or Unauthorized')
  }
}

module.exports = authRequired
