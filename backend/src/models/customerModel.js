const db = require('../config/db');

const customerModel = {
  findAll: async (search = '') => {
    let query = 'SELECT * FROM customers';
    const params = [];

    if (search) {
      query += ' WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY total_sales DESC, created_at DESC';
    const [rows] = await db.query(query, params);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM customers WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (data) => {
    const { name, email, phone, street1, street2, city, state, country = 'India' } = data;
    const [result] = await db.query(
      `INSERT INTO customers 
      (name, email, phone, street1, street2, city, state, country) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, street1, street2, city, state, country]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { name, email, phone, street1, street2, city, state, country } = data;
    const [result] = await db.query(
      `UPDATE customers 
       SET name=?, email=?, phone=?, street1=?, street2=?, city=?, state=?, country=?
       WHERE id=?`,
      [name, email, phone, street1, street2, city, state, country, id]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM customers WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = customerModel;
