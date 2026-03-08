const { pool } = require('../configs/database')
const {
  buildQueryParams,
  buildQueryParamsNoPagination,
} = require('../utils/queryBuilder')

class Message {
  async create(conversationId, senderId, content) {
    const [{ insertId }] = await pool.execute(
      `INSERT INTO messages (conversation_id, sender_id, content)
      VALUES (?, ?, ?)`,
      [conversationId, senderId, content],
    )
    return insertId
  }

  async findAll(limit = 20, offset = 0, conditions) {
    const { params, whereSQL } = buildQueryParams(conditions, limit, offset)

    const [rows] = await pool.execute(
      `SELECT
        u.name,
        u.email,
        m.content,
        m.created_at
      FROM
        messages m
      JOIN users u ON u.id = m.sender_id 
      ${whereSQL} 
      ORDER BY
        m.created_at ASC,
        m.id DESC 
        LIMIT ? OFFSET ?`,
      params,
    )
    return rows
  }

  async count(conditions) {
    const { params, whereSQL } = buildQueryParamsNoPagination(conditions)

    const [rows] = await pool.execute(
      `SELECT
        COUNT(*) AS total
      FROM
        messages m
      JOIN users u ON u.id = m.sender_id 
      ${whereSQL}`,
      params,
    )
    return rows[0].total
  }
}

module.exports = new Message()
