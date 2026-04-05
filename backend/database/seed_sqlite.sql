-- Users table
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@jorshor.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGGa31S.', 'admin'),
('Cashier One', 'cashier@jorshor.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGGa31S.', 'cashier');

-- Product Categories
INSERT INTO categories (name, color, sequence) VALUES
('Quick Bites', '#e07b39', 1),
('Drinks',      '#4caf50', 2),
('Dessert',     '#9c27b0', 3),
('Pastries',    '#2196f3', 4);

-- Products
INSERT INTO products 
(name, price, tax, uom, category_id, stock) VALUES
('Burger',      25.00, 5, 'Unit', 1, 100),
('Pizza',       35.00, 5, 'Unit', 1, 100),
('Sandwich',    20.00, 5, 'Unit', 1, 100),
('Pasta',       30.00, 5, 'Unit', 1, 100),
('Coffee',      15.00, 5, 'Unit', 2, 100),
('Water',        5.00, 5, 'Unit', 2, 100),
('Green Tea',   20.00, 5, 'Unit', 2, 100),
('Fanta',       40.00, 5, 'Unit', 2, 100),
('MilkShake',   60.00, 5, 'Unit', 2, 100),
('Dessert Cake',30.00, 5, 'Unit', 3, 100);

-- Floor Plans
INSERT INTO floor_plans (name, pos_terminal) VALUES
('Ground Floor', 'Jor Shor Cafe');

-- Tables
INSERT INTO tables 
(floor_plan_id, table_number, seats, status) VALUES
(1, 1, 5, 'available'),
(1, 2, 5, 'available'),
(1, 3, 5, 'available'),
(1, 4, 5, 'available'),
(1, 5, 5, 'available'),
(1, 6, 5, 'occupied'),
(1, 7, 5, 'available');

-- POS Sessions
INSERT INTO pos_sessions 
(name, opening_balance, status) VALUES
('Session 01', 0.00, 'open');

-- Customers
INSERT INTO customers (name, email, phone, city, state) VALUES
('Eric',  'eric@jorshor.com',  '+91 9876543210', 'Gandhinagar', 'Gujarat'),
('Smith', 'smith@jorshor.com', '+91 9876543211', 'Ahmedabad',   'Gujarat'),
('Jacek', 'jacek@jorshor.com', '+91 9876543212', 'Surat',       'Gujarat');
