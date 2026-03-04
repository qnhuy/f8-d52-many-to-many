const responseFormat = (_, res, next) => {
  res.success = (data, status = 200, rest = {}) => {
    res.status(status).json({
      status: 'success',
      data,
      ...rest,
    })
  }

  res.paginate = ({ rows, pagination }) => {
    res.success(rows, 200, { pagination })
  }

  res.error = (status, message, error = null) => {
    res.status(status).json({
      status: 'error',
      error,
      message,
    })
  }

  next()
}

module.exports = responseFormat
