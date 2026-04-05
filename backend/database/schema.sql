-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','cashier') DEFAULT 'cashier',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
             ON UPDATE CURRENT_TIMESTAMP
);

-- Product Categories
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(20) DEFAULT '#ffffff',
  sequence INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  tax DECIMAL(5,2) DEFAULT 5.00,
  uom ENUM('Unit','KG','Liter') DEFAULT 'Unit',
  category_id INT,
  stock INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
             ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
             ON DELETE SET NULL
);

-- Product Variants
CREATE TABLE IF NOT EXISTS product_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  value VARCHAR(100) NOT NULL,
  unit VARCHAR(50),
  extra_price DECIMAL(10,2) DEFAULT 0.00,
  FOREIGN KEY (product_id) REFERENCES products(id)
             ON DELETE CASCADE
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  street1 VARCHAR(255),
  street2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'India',
  total_sales DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
             ON UPDATE CURRENT_TIMESTAMP
);

-- Floor Plans
CREATE TABLE IF NOT EXISTS floor_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  pos_terminal VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tables
CREATE TABLE IF NOT EXISTS tables (
  id INT AUTO_INCREMENT PRIMARY KEY,
  floor_plan_id INT,
  table_number INT NOT NULL,
  seats INT DEFAULT 4,
  is_active BOOLEAN DEFAULT TRUE,
  status ENUM('available','occupied','reserved') 
         DEFAULT 'available',
  FOREIGN KEY (floor_plan_id) REFERENCES floor_plans(id)
             ON DELETE SET NULL
);

-- POS Sessions
CREATE TABLE IF NOT EXISTS pos_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) DEFAULT 'Session 01',
  opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  closed_at TIMESTAMP NULL,
  opening_balance DECIMAL(10,2) DEFAULT 0.00,
  closing_balance DECIMAL(10,2) DEFAULT 0.00,
  status ENUM('open','closed') DEFAULT 'open',
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(20) UNIQUE NOT NULL,
  session_id INT,
  table_id INT,
  customer_id INT,
  subtotal DECIMAL(10,2) DEFAULT 0.00,
  tax_total DECIMAL(10,2) DEFAULT 0.00,
  total DECIMAL(10,2) DEFAULT 0.00,
  status ENUM('draft','paid','cancelled','refunded')
         DEFAULT 'draft',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
             ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES pos_sessions(id),
  FOREIGN KEY (table_id) REFERENCES tables(id),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
             ON DELETE SET NULL
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  tax DECIMAL(5,2) DEFAULT 5.00,
  subtotal DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id)
             ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  method ENUM('Cash','Digital','UPI') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  upi_id VARCHAR(100),
  reference VARCHAR(100),
  status ENUM('pending','completed','failed','refunded')
         DEFAULT 'pending',
  paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
             ON DELETE CASCADE
);
