const db = require('../config/db');

const tableModel = {
  findAll: async (filters = {}) => {
    let query = `
      SELECT t.*, f.name as floor_plan_name
      FROM tables t
      LEFT JOIN floor_plans f ON t.floor_plan_id = f.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.floor_plan_id) {
      query += ' AND t.floor_plan_id = ?';
      params.push(filters.floor_plan_id);
    }
    if (filters.status) {
      query += ' AND t.status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY f.id, t.table_number';
    const [rows] = await db.query(query, params);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM tables WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (data) => {
    const { floor_plan_id, table_number, seats } = data;
    const [result] = await db.query(
      'INSERT INTO tables (floor_plan_id, table_number, seats) VALUES (?, ?, ?)',
      [floor_plan_id, table_number, seats || 4]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { seats, is_active, status } = data;
    const [result] = await db.query(
      'UPDATE tables SET seats=?, is_active=?, status=? WHERE id=?',
      [seats, is_active, status, id]
    );
    return result.affectedRows > 0;
  },

  updateStatus: async (id, status) => {
    const [result] = await db.query('UPDATE tables SET status=? WHERE id=?', [status, id]);
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM tables WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = tableModel;
