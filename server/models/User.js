const pool = require('../config/db');
const { toCamelCase } = require('../utils/helpers');

const User = {
  async findById(id) {
    const { rows } = await pool.query(
      'SELECT id, name, email, avatar, bio, job_title, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    return toCamelCase(rows[0]) || null;
  },

  async findByEmail(email) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return toCamelCase(rows[0]) || null;
  },

  async create({ name, email, password }) {
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, avatar, bio, job_title',
      [name, email, password]
    );
    return toCamelCase(rows[0]);
  },

  async update(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    if (keys.length === 0) return this.findById(id);
    const setClause = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
    const { rows } = await pool.query(
      `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, name, email, avatar, bio, job_title`,
      [id, ...values]
    );
    return toCamelCase(rows[0]);
  },

  async deleteById(id) {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  },
};

module.exports = User;

