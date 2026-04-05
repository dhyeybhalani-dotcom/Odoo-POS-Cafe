const db = require('../config/db');

const paymentModel = {
  findByOrderId: async (orderId) => {
    const [rows] = await db.query('SELECT * FROM payments WHERE order_id = ?', [orderId]);
    return rows;
  },

  findFiltered: async (filters = {}) => {
    let query = `
      SELECT p.*, o.order_number 
      FROM payments p
      JOIN orders o ON p.order_id = o.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.method) {
      query += ' AND p.method = ?';
      params.push(filters.method);
    }
    
    if (filters.from && filters.to) {
      query += ' AND DATE(p.paid_at) BETWEEN ? AND ?';
      params.push(filters.from, filters.to);
    }

    query += ' ORDER BY p.paid_at DESC';

    const [rows] = await db.query(query, params);
    return rows;
  },

  create: async (paymentData) => {
    const { order_id, method, amount, upi_id = null, reference = null, status = 'completed' } = paymentData;
    const [result] = await db.query(
      'INSERT INTO payments (order_id, method, amount, upi_id, reference, status) VALUES (?, ?, ?, ?, ?, ?)',
      [order_id, method, amount, upi_id, reference, status]
    );
    return result.insertId;
  }
};

module.exports = paymentModel;
