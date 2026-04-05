const db = require('../config/db');

const sessionModel = {
  findActive: async (userId) => {
    const [rows] = await db.query(
      'SELECT * FROM pos_sessions WHERE user_id = ? AND status = "open" LIMIT 1',
      [userId]
    );
    return rows[0];
  },

  create: async (sessionData) => {
    const { user_id, start_at, opening_balance } = sessionData;
    const [result] = await db.query(
      'INSERT INTO pos_sessions (user_id, start_at, opening_balance, status) VALUES (?, ?, ?, "open")',
      [user_id, start_at || new Date(), opening_balance || 0.00]
    );
    return result.insertId;
  },

  close: async (id, closingData) => {
    const { end_at, closing_balance, total_sales } = closingData;
    const [result] = await db.query(
      'UPDATE pos_sessions SET end_at = ?, closing_balance = ?, total_sales = ?, status = "closed" WHERE id = ?',
      [end_at || new Date(), closing_balance, total_sales, id]
    );
    return result.affectedRows > 0;
  },

  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM pos_sessions ORDER BY id DESC');
    return rows;
  }
};

module.exports = sessionModel;
