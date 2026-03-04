const createRateLimiter = ({ windowMS, maxRequest, message }) => {
  // data structure: ip --> { count, resetTime }
  const rateLimitMap = new Map()

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress
    const now = Date.now()
    let record = rateLimitMap.get(ip)

    if (!record || now >= record.resetTime) {
      record = { count: 1, resetTime: now + windowMS }
      rateLimitMap.set(ip, record)
    } else {
      record.count += 1
    }

    if (record.count > maxRequest) return res.error(429, message)

    if (rateLimitMap.size > 10000) {
      const now = Date.now()
      for (const [ip, record] of rateLimitMap.entries()) {
        if (now >= record.resetTime) rateLimitMap.delete(ip)
      }
    }

    next()
  }
}

const defaultConfig = {
  windowMS: 60000,
  maxRequest: 100,
  message: 'Too many requests',
}

const apiRateLimiter = createRateLimiter(defaultConfig)

module.exports = { apiRateLimiter, createRateLimiter }
