const db = require('../config/db');

const productModel = {
  findAll: async (filters = {}) => {
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_archived = ?
    `;
    const params = [filters.archived === 'true' ? 1 : 0];

    if (filters.category) {
      query += ' AND p.category_id = ?';
      params.push(filters.category);
    }

    if (filters.search) {
      query += ' AND p.name LIKE ?';
      params.push(`%${filters.search}%`);
    }

    query += ' ORDER BY p.id DESC';
    
    // Support pagination easily in the future
    if (filters.limit) {
      query += ' LIMIT ? OFFSET ?';
      params.push(Number(filters.limit), Number(filters.offset || 0));
    }

    const [rows] = await db.query(query, params);
    
    // Check total count if paginating
    let total = rows.length;
    if (filters.limit) {
      const [countResult] = await db.query('SELECT COUNT(*) as calcTotal FROM products WHERE is_archived = ?', [filters.archived === 'true' ? 1 : 0]);
      total = countResult[0].calcTotal;
    }

    return { products: rows, total };
  },

  findById: async (id) => {
    const [rows] = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ?
    `, [id]);

    if (!rows[0]) return null;

    // Fetch variants
    const [variants] = await db.query('SELECT * FROM product_variants WHERE product_id = ?', [id]);
    return { ...rows[0], variants };
  },

  create: async (productData, variants = []) => {
    const { name, description, price, tax, uom, category_id, stock } = productData;

    const [result] = await db.query(
      'INSERT INTO products (name, description, price, tax, uom, category_id, stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, tax, uom, category_id, stock]
    );

    const productId = result.insertId;

    if (variants && variants.length > 0) {
      for (const variant of variants) {
        await db.query(
          'INSERT INTO product_variants (product_id, value, unit, extra_price) VALUES (?, ?, ?, ?)',
          [productId, variant.value, variant.unit, variant.extra_price || 0.00]
        );
      }
    }

    return productId;
  },

  update: async (id, productData, variants = []) => {
    const { name, description, price, tax, uom, category_id, stock, is_active } = productData;

    await db.query(
      'UPDATE products SET name=?, description=?, price=?, tax=?, uom=?, category_id=?, stock=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?',
      [name, description, price, tax, uom, category_id, stock, is_active !== undefined ? is_active : 1, id]
    );

    if (variants !== undefined) {
      await db.query('DELETE FROM product_variants WHERE product_id = ?', [id]);
      for (const variant of variants) {
        await db.query(
          'INSERT INTO product_variants (product_id, value, unit, extra_price) VALUES (?, ?, ?, ?)',
          [id, variant.value, variant.unit, variant.extra_price || 0.00]
        );
      }
    }

    return true;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
    return result.changes > 0;
  },

  archive: async (id) => {
    const [result] = await db.query('UPDATE products SET is_archived = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
    return result.changes > 0;
  }
};

module.exports = productModel;
