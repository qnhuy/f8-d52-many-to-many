const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
  waitForConnections: true,
  enableKeepAlive: true,
})

module.exports = { pool }
