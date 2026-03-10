const { pool } = require('../configs/database')

class RevokedToken {
  async checkExist(token) {
    const [rows] = await pool.execute(
      'SELECT * FROM revoked_tokens WHERE token = ?',
      [token],
    )
    return rows?.length > 0
  }

  async create(token) {
    const [{ insertId }] = await pool.execute(
      'INSERT INTO revoked_tokens (token) VALUES (?)',
      [token],
    )
    return insertId
  }
}

module.exports = new RevokedToken()
