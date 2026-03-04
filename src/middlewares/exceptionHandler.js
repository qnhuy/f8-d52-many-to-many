const exceptionHandler = (err, _, res, __) => {
  res.error(500, err.message, err)
}

module.exports = exceptionHandler
