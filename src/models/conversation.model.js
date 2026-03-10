const { pool } = require('../configs/database')
const {
  buildQueryParams,
  buildQueryParamsNoPagination,
} = require('../utils/queryBuilder')

class Conversation {
  async findUserConversations(limit = 20, offset = 0, conditions) {
    const { params, whereSQL } = buildQueryParams(conditions, limit, offset)

    const [rows] = await pool.execute(
      `SELECT
        c.name,
        c.type,
        c.created_at,
        c.updated_at
      FROM
        conversations c
        JOIN conversation_participants cp ON cp.conversation_id = c.id 
      ${whereSQL} 
      LIMIT ? OFFSET ?`,
      params,
    )
    return rows
  }

  async countUserConversations(conditions) {
    const { params, whereSQL } = buildQueryParamsNoPagination(conditions)
    const [rows] = await pool.execute(
      `SELECT
        COUNT(*) AS total
      FROM
        conversations c
        JOIN conversation_participants cp ON cp.conversation_id = c.id
      ${whereSQL}`,
      params,
    )
    return rows[0].total
  }

  async findAll(limit = 20, offset = 0, conditions) {
    const { params, whereSQL } = buildQueryParams(conditions, limit, offset)

    const [rows] = await pool.execute(
      `SELECT * FROM conversations ${whereSQL} LIMIT ? OFFSET ?`,
      params,
    )
    return rows
  }

  async count(conditions) {
    const { params, whereSQL } = buildQueryParamsNoPagination(conditions)

    const [result] = await pool.execute(
      `SELECT COUNT(*) AS total FROM conversations ${whereSQL}`,
      params,
    )
    return result[0].total
  }

  async create(name, type, participantIds, userId) {
    const [{ insertId }] = await pool.execute(
      'INSERT INTO conversations (name, type, created_by) VALUES (?, ?, ?)',
      [name, type, userId],
    )

    const placeholders = participantIds.map(() => '(?, ?)').join(', ')
    const values = participantIds.flatMap((userId) => [userId, insertId])

    await pool.execute(
      `INSERT INTO conversation_participants (user_id, conversation_id) 
      VALUES ${placeholders}`,
      values,
    )

    return insertId
  }

  async addNewUser(conversationId, userId) {
    const [{ insertId }] = await pool.execute(
      `INSERT INTO conversation_participants (user_id, conversation_id)
      VALUES (?, ?)`,
      [userId, conversationId],
    )

    return insertId
  }

  async findOne(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, type FROM conversations WHERE id = ?',
      [id],
    )
    return rows[0]
  }

  async isUserMember(conversationId, userId) {
    const [rows] = await pool.execute(
      `SELECT id FROM conversation_participants WHERE conversation_id = ? AND user_id = ? LIMIT 1`,
      [conversationId, userId],
    )
    return rows.length > 0
  }
}

module.exports = new Conversation()
