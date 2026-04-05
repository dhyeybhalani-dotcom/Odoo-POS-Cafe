const db = require('../config/db');

const userModel = {
  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },
  
  findById: async (id) => {
    const [rows] = await db.query('SELECT id, name, email, role, profile_pic, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (userData) => {
    const { name, email, password, role = 'cashier' } = userData;
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );
    
    return { id: result.insertId, name, email, role };
  },

  updateProfile: async (id, name, profile_pic) => {
    const [result] = await db.query(
      'UPDATE users SET name = ?, profile_pic = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, profile_pic, id]
    );
    return result.changes > 0;
  }
};

module.exports = userModel;
