const db = require('../config/db');

const analyticsService = {
  getDashboardData: async (from, to, terminal) => {
    const params = [];
    let dateFilter = '';
    let isToday = false;
    
    if (from && to) {
      dateFilter = " AND date(o.created_at, 'localtime') BETWEEN ? AND ?";
      params.push(from, to);
      if (from === to) isToday = true;
    }

    // Revenue computations
    const [revenueRes] = await db.query(
      `SELECT COALESCE(SUM(o.total), 0) as total FROM orders o WHERE o.status = 'paid' ${dateFilter}`, 
      params
    );
    const revenue = revenueRes[0].total;

    const [pendingRes] = await db.query(
      `SELECT COALESCE(SUM(o.total), 0) as total FROM orders o WHERE o.status = 'draft' ${dateFilter}`,
      params
    );
    const pending = pendingRes[0].total;

    // Correct sum of orders count
    const [ordersCountRes] = await db.query(
      `SELECT COUNT(*) as count FROM orders o WHERE 1=1 ${dateFilter}`,
      params
    );
    const orderCount = ordersCountRes[0].count;

    // Sales over time (Hourly for Today, Daily otherwise)
    let salesOverTimeRows;
    if (isToday) {
      [salesOverTimeRows] = await db.query(
        `SELECT strftime('%H:00', o.created_at, 'localtime') as time, SUM(o.total) as revenue 
         FROM orders o 
         WHERE o.status = 'paid' ${dateFilter} 
         GROUP BY strftime('%H', o.created_at, 'localtime') 
         ORDER BY time ASC`,
        params
      );
    } else {
      [salesOverTimeRows] = await db.query(
        `SELECT strftime('%m-%d', o.created_at, 'localtime') as time, SUM(o.total) as revenue 
         FROM orders o 
         WHERE o.status = 'paid' ${dateFilter} 
         GROUP BY date(o.created_at, 'localtime') 
         ORDER BY date(o.created_at, 'localtime') ASC`,
        params
      );
    }

    // Category Share
    const [categoryRows] = await db.query(
      `SELECT c.name, SUM(oi.total) as value, c.color
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       JOIN products p ON oi.product_id = p.id
       JOIN categories c ON p.category_id = c.id
       WHERE o.status = 'paid' ${dateFilter}
       GROUP BY c.id
       ORDER BY value DESC`,
       params
    );
    
    const totalCatSales = categoryRows.reduce((acc, row) => acc + Number(row.value), 0);
    const categoryShare = categoryRows.map(c => ({
      name: c.name,
      color: c.color || '#333',
      value: totalCatSales > 0 ? parseFloat(((c.value / totalCatSales) * 100).toFixed(1)) : 0,
      revenue: c.value
    }));

    // Top Products
    const [topProducts] = await db.query(
      `SELECT p.name, c.name as category, SUM(oi.quantity) as qty, SUM(oi.total) as revenue
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       JOIN products p ON oi.product_id = p.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE o.status = 'paid' ${dateFilter}
       GROUP BY oi.product_id
       ORDER BY revenue DESC
       LIMIT 5`,
       params
    );

    // Top Orders
    const [topOrders] = await db.query(
      `SELECT o.order_number as id, 
              COALESCE(s.name, 'No Session') as session, 
              'Point of Sale 01' as pos, 
              o.created_at as date, 
              COALESCE(cust.name, 'Walking Customer') as customer, 
              COALESCE(u.name, 'System') as employee, 
              o.total
       FROM orders o
       LEFT JOIN pos_sessions s ON o.session_id = s.id
       LEFT JOIN users u ON s.user_id = u.id
       LEFT JOIN customers cust ON o.customer_id = cust.id
       WHERE 1=1 ${dateFilter}
       ORDER BY o.total DESC
       LIMIT 5`,
       params
    );

    return {
      revenue,
      pending,
      orderCount,
      salesOverTime: salesOverTimeRows,
      categoryShare,
      topProducts,
      topOrders,
      topCategories: categoryRows.map(c => ({ name: c.name, revenue: c.value }))
    };
  },

  getSummary: async () => {
    // Generate 'Today' based on local time so it matches SQLite 'localtime'
    const today = new Date();
    // adjust date to local timezone date string
    const localDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    
    const [rowsToday] = await db.query(`SELECT COALESCE(SUM(total), 0) as todayRevenue FROM orders WHERE status='paid' AND date(created_at, 'localtime') = ?`, [localDate]);
    const todayRevenue = rowsToday[0]?.todayRevenue || 0;

    const [rowsMonth] = await db.query(`SELECT COALESCE(SUM(total), 0) as monthRevenue FROM orders WHERE status='paid' AND strftime('%m', created_at, 'localtime') = strftime('%m', 'now', 'localtime')`);
    const monthRevenue = rowsMonth[0]?.monthRevenue || 0;
    
    const [orderStats] = await db.query(`
      SELECT 
        COUNT(*) as totalOrders,
        SUM(CASE WHEN status='paid' THEN 1 ELSE 0 END) as paidOrders,
        SUM(CASE WHEN status='draft' THEN 1 ELSE 0 END) as draftOrders
      FROM orders
    `);

    const [prodStats] = await db.query(`SELECT COUNT(*) as totalProducts FROM products WHERE is_active=1 AND is_archived=0`);
    const [custStats] = await db.query(`SELECT COUNT(*) as totalCustomers FROM customers`);

    return {
      todayRevenue, monthRevenue,
      totalOrders: orderStats[0].totalOrders,
      paidOrders: orderStats[0].paidOrders,
      draftOrders: orderStats[0].draftOrders,
      totalProducts: prodStats[0].totalProducts,
      totalCustomers: custStats[0].totalCustomers
    };
  }
};

module.exports = analyticsService;
