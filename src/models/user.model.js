const { pool } = require('../configs/database')

class User {
  async findAll(limit = 20, offset = 0) {
    const [rows] = await pool.execute(
      `SELECT name, email FROM users LIMIT ? OFFSET ?`,
      [limit, offset],
    )
    return rows
  }

  async count() {
    const [rows] = await pool.execute('SELECT COUNT(*) AS total FROM users')
    return rows[0].total
  }

  async findOne(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email FROM users WHERE id = ?',
      [id],
    )
    return rows[0]
  }

  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, password FROM users WHERE email = ?',
      [email],
    )
    return rows[0]
  }

  async searchByEmail(email, excludeUserId) {
    const [rows] = await pool.execute(
      'SELECT id, email FROM users WHERE email like ? AND id != ? LIMIT 20',
      [`%${email}%`, excludeUserId],
    )
    return rows
  }

  async findByEmailAndPassword(email, password) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, password FROM users WHERE email = ? AND password = ?',
      [email, password],
    )
    return rows[0]
  }

  async create(email, password) {
    const [{ insertId }] = await pool.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, password],
    )
    return insertId
  }

  async findByRefreshToken(token) {
    const [rows] = await pool.execute(
      'SELECT id, name, email FROM users WHERE refresh_token = ? AND refresh_expires_at >= NOW() LIMIT 1',
      [token],
    )
    return rows[0]
  }

  async updateRefreshToken(id, token, expire) {
    const [{ affectedRows }] = await pool.execute(
      'UPDATE users SET refresh_token = ?, refresh_expires_at = ? WHERE id = ?',
      [token, expire, id],
    )
    return affectedRows
  }
}

module.exports = new User()
