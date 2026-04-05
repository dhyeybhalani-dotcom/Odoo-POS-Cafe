const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../database/db.json');

const initialData = {
  users: [
    { id: 1, name: 'Admin', email: 'admin@jorshor.com', password: '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGGa31S.', role: 'admin' },
    { id: 2, name: 'Cashier One', email: 'cashier@jorshor.com', password: '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGGa31S.', role: 'cashier' }
  ],
  categories: [
    { id: 1, name: 'Quick Bites', color: '#e07b39' },
    { id: 2, name: 'Drinks', color: '#4caf50' },
    { id: 3, name: 'Dessert', color: '#9c27b0' }
  ],
  products: [
    { id: 1, name: 'Burger', price: 25.00, category_name: 'Quick Bites', stock: 100 },
    { id: 2, name: 'Pizza', price: 35.00, category_name: 'Quick Bites', stock: 100 },
    { id: 3, name: 'Coffee', price: 15.00, category_name: 'Drinks', stock: 100 },
    { id: 4, name: 'Cake', price: 30.00, category_name: 'Dessert', stock: 100 }
  ],
  tables: [
    { id: 1, table_number: 1, status: 'available' },
    { id: 2, table_number: 2, status: 'available' },
    { id: 3, table_number: 3, status: 'occupied' }
  ],
  orders: [],
  customers: [
    { id: 1, name: 'Eric', city: 'Gandhinagar', total_sales: 0 },
    { id: 2, name: 'Smith', city: 'Ahmedabad', total_sales: 0 }
  ],
  pos_sessions: [{ id: 1, name: 'Session 01', status: 'open' }]
};

try {
  fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  console.log('✅ Mock Database (JSON) initialized with seed data.');
} catch (err) {
  console.error('❌ Failed to initialize mock DB:', err.message);
}
