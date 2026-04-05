const db = require('../config/db');
const { generateOrderNumber, calculateOrderTotals } = require('../utils/helpers');

const orderService = {
  createOrder: async (orderData) => {
    const { session_id, table_id, customer_id, items = [], notes } = orderData;

    if (!items || items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    const { subtotal, taxTotal, total } = calculateOrderTotals(items);
    const orderNumber = generateOrderNumber();

    // SQLite doesn't support connection pooling — use db.query with manual
    // BEGIN/COMMIT transaction statements for atomicity.
    try {
      await db.query('BEGIN', []);

      // 1. Insert Order (status = 'draft' initially, update to 'paid' separately via updateStatus)
      const [orderResult] = await db.query(
        `INSERT INTO orders (order_number, session_id, table_id, customer_id, subtotal, tax_total, total, status, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?)`,
        [orderNumber, session_id || null, table_id || null, customer_id || null, subtotal, taxTotal, total, notes || null]
      );
      const orderId = orderResult.insertId;

      // 2. Insert Order Items & Deduct Stock
      for (const item of items) {
        const qty = Number(item.quantity) || 1;
        const unitPrice = Number(item.unit_price) || 0;
        const taxRate = Number(item.tax) || 5.0;
        const itemSubtotal = (qty * unitPrice).toFixed(2);
        const itemTax = (parseFloat(itemSubtotal) * (taxRate / 100)).toFixed(2);
        const itemTotal = (parseFloat(itemSubtotal) + parseFloat(itemTax)).toFixed(2);

        // Get product name from DB
        const [productRows] = await db.query('SELECT name FROM products WHERE id = ?', [item.product_id]);
        const productName = productRows[0]?.name || item.product_name || 'Unknown';

        await db.query(
          `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, tax, subtotal, total)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [orderId, item.product_id, productName, qty, unitPrice, taxRate, itemSubtotal, itemTotal]
        );

        // Deduct stock (only if stock tracking matters)
        await db.query(
          'UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?',
          [qty, item.product_id]
        );
      }

      // 3. Update Table Status to occupied
      if (table_id) {
        await db.query("UPDATE tables SET status = 'occupied' WHERE id = ?", [table_id]);
      }

      // 4. Update Customer Total Sales
      if (customer_id) {
        await db.query(
          'UPDATE customers SET total_sales = total_sales + ? WHERE id = ?',
          [total, customer_id]
        );
      }

      await db.query('COMMIT', []);

      return {
        id: orderId,
        order_number: orderNumber,
        subtotal,
        tax_total: taxTotal,
        total,
        status: 'draft'
      };

    } catch (error) {
      // Rollback on failure
      try { await db.query('ROLLBACK', []); } catch (e) { /* ignore rollback error */ }
      throw error;
    }
  }
};

module.exports = orderService;
