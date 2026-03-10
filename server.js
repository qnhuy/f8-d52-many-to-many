require('dotenv').config()
const express = require('express')
const cors = require('cors')
const responseFormat = require('./src/middlewares/responseFormat')
const exceptionHandler = require('./src/middlewares/exceptionHandler')
const notFoundHandler = require('./src/middlewares/notFoundHandler')
const { apiRateLimiter } = require('./src/middlewares/rateLimiter')
const appRouter = require('./src/routes')
const corsOptions = require('./src/configs/cors')

const app = express()
const port = process.env.PORT || 3000

app.use(cors(corsOptions))
app.use(express.json())
app.use(responseFormat)
app.use(apiRateLimiter)

app.use('/api', appRouter)

app.use(notFoundHandler)
app.use(exceptionHandler)

app.listen(port, () => {
  console.log('Listening on port ' + port)
})
