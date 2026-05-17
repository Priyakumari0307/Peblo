const pool = require('../config/db');
const { toCamelCase, toCamelCaseArray } = require('../utils/helpers');

const Note = {
  async findAll(userId, { search, category, tag, sort } = {}) {
    let sql = 'SELECT * FROM notes WHERE user_id = $1 AND is_archived = false';
    const params = [userId];
    let paramIdx = 2;

    if (search) {
      sql += ` AND (title ILIKE $${paramIdx} OR content ILIKE $${paramIdx} OR $${paramIdx} = ANY(tags))`;
      params.push(`%${search}%`);
      paramIdx++;
    }
    if (category && category !== 'All') {
      sql += ` AND category = $${paramIdx}`;
      params.push(category);
      paramIdx++;
    }
    if (tag) {
      sql += ` AND $${paramIdx} = ANY(tags)`;
      params.push(tag);
      paramIdx++;
    }

    const sortMap = {
      oldest: 'updated_at ASC',
      alphabetical: 'title ASC',
      'alphabetical-desc': 'title DESC',
    };
    sql += ` ORDER BY ${sortMap[sort] || 'updated_at DESC'}`;

    const { rows } = await pool.query(sql, params);
    return toCamelCaseArray(rows);
  },

  async findArchived(userId) {
    const { rows } = await pool.query(
      'SELECT * FROM notes WHERE user_id = $1 AND is_archived = true ORDER BY updated_at DESC',
      [userId]
    );
    return toCamelCaseArray(rows);
  },

  async findById(id, userId) {
    const { rows } = await pool.query(
      'SELECT * FROM notes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return toCamelCase(rows[0]) || null;
  },

  async create({ userId, title, content, tags, category }) {
    const { rows } = await pool.query(
      `INSERT INTO notes (user_id, title, content, tags, category)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, title || 'Untitled Note', content || '', tags || [], category || 'General']
    );
    return toCamelCase(rows[0]);
  },

  async update(id, userId, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    if (keys.length === 0) return this.findById(id, userId);
    const setClause = keys.map((k, i) => `${k} = $${i + 3}`).join(', ');
    const { rows } = await pool.query(
      `UPDATE notes SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId, ...values]
    );
    return toCamelCase(rows[0]) || null;
  },

  async deleteById(id, userId) {
    const result = await pool.query(
      'DELETE FROM notes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rowCount > 0;
  },

  async deleteByUserId(userId) {
    await pool.query('DELETE FROM notes WHERE user_id = $1', [userId]);
  },

  async findByShareId(shareId) {
    const { rows } = await pool.query(
      `SELECT n.*, u.name as user_name FROM notes n
       JOIN users u ON n.user_id = u.id
       WHERE n.share_id = $1 AND n.is_public = true`,
      [shareId]
    );
    return toCamelCase(rows[0]) || null;
  },

  async countByUserId(userId, archived) {
    const { rows } = await pool.query(
      'SELECT COUNT(*) FROM notes WHERE user_id = $1 AND is_archived = $2',
      [userId, archived]
    );
    return parseInt(rows[0].count);
  },

  async sumAiUsage(userId) {
    const { rows } = await pool.query(
      'SELECT COALESCE(SUM(ai_usage_count), 0) as total FROM notes WHERE user_id = $1',
      [userId]
    );
    return parseInt(rows[0].total);
  },

  async topTags(userId, limit = 5) {
    const { rows } = await pool.query(
      `SELECT unnest(tags) as tag, COUNT(*) as count
       FROM notes WHERE user_id = $1
       GROUP BY tag ORDER BY count DESC LIMIT $2`,
      [userId, limit]
    );
    return rows;
  },

  async weeklyActivity(userId) {
    const { rows } = await pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM notes WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(created_at) ORDER BY date`,
      [userId]
    );
    return rows;
  },

  async recentNotes(userId, limit = 3) {
    const { rows } = await pool.query(
      'SELECT title, updated_at, category FROM notes WHERE user_id = $1 AND is_archived = false ORDER BY updated_at DESC LIMIT $2',
      [userId, limit]
    );
    return toCamelCaseArray(rows);
  },
};

module.exports = Note;
