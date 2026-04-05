const db = require('../config/db');

const orderModel = {
  findAll: async (filters = {}) => {
    let query = `
      SELECT o.*, 
             c.name as customer_name,
             t.table_number,
             s.name as session_name
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN tables t ON o.table_id = t.id
      LEFT JOIN pos_sessions s ON o.session_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      query += ' AND o.status = ?';
      params.push(filters.status);
    }
    if (filters.session_id) {
      query += ' AND o.session_id = ?';
      params.push(filters.session_id);
    }
    if (filters.customer_id) {
      query += ' AND o.customer_id = ?';
      params.push(filters.customer_id);
    }
    if (filters.from && filters.to) {
      query += ' AND DATE(o.created_at) BETWEEN ? AND ?';
      params.push(filters.from, filters.to);
    }

    query += ' ORDER BY o.created_at DESC';

    const [rows] = await db.query(query, params);
    return { orders: rows, total: rows.length };
  },

  findById: async (id) => {
    const [rows] = await db.query(`
      SELECT o.*, 
             c.name as customer_name, c.email as customer_email,
             t.table_number, fp.name as floor_name
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN tables t ON o.table_id = t.id
      LEFT JOIN floor_plans fp ON t.floor_plan_id = fp.id
      WHERE o.id = ?
    `, [id]);
    return rows[0];
  },

  updateStatus: async (id, status) => {
    const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0;
  },

  deleteDraft: async (id) => {
    // Only delete if it's draft, enforced by controller
    const [result] = await db.query('DELETE FROM orders WHERE id = ? AND status = "draft"', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = orderModel;
