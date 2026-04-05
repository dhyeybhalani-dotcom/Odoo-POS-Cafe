-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK(role IN ('admin','cashier')) DEFAULT 'cashier',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Product Categories
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#ffffff',
  sequence INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  tax DECIMAL(5,2) DEFAULT 5.00,
  uom TEXT CHECK(uom IN ('Unit','KG','Liter')) DEFAULT 'Unit',
  category_id INTEGER,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT 1,
  is_archived BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Product Variants
CREATE TABLE IF NOT EXISTS product_variants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  value TEXT NOT NULL,
  unit TEXT,
  extra_price DECIMAL(10,2) DEFAULT 0.00,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  street1 TEXT,
  street2 TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  total_sales DECIMAL(10,2) DEFAULT 0.00,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Floor Plans
CREATE TABLE IF NOT EXISTS floor_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  pos_terminal TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tables
CREATE TABLE IF NOT EXISTS tables (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  floor_plan_id INTEGER,
  table_number INTEGER NOT NULL,
  seats INTEGER DEFAULT 4,
  is_active BOOLEAN DEFAULT 1,
  status TEXT CHECK(status IN ('available','occupied','reserved')) DEFAULT 'available',
  FOREIGN KEY (floor_plan_id) REFERENCES floor_plans(id) ON DELETE SET NULL
);

-- POS Sessions
CREATE TABLE IF NOT EXISTS pos_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT DEFAULT 'Session 01',
  opened_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  closed_at DATETIME,
  opening_balance DECIMAL(10,2) DEFAULT 0.00,
  closing_balance DECIMAL(10,2) DEFAULT 0.00,
  status TEXT CHECK(status IN ('open','closed')) DEFAULT 'open',
  user_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT UNIQUE NOT NULL,
  session_id INTEGER,
  table_id INTEGER,
  customer_id INTEGER,
  subtotal DECIMAL(10,2) DEFAULT 0.00,
  tax_total DECIMAL(10,2) DEFAULT 0.00,
  total DECIMAL(10,2) DEFAULT 0.00,
  status TEXT CHECK(status IN ('draft','paid','cancelled','refunded')) DEFAULT 'draft',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES pos_sessions(id),
  FOREIGN KEY (table_id) REFERENCES tables(id),
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  tax DECIMAL(5,2) DEFAULT 5.00,
  subtotal DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  method TEXT CHECK(method IN ('Cash','Digital','UPI')) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  upi_id TEXT,
  reference TEXT,
  status TEXT CHECK(status IN ('pending','completed','failed','refunded')) DEFAULT 'pending',
  paid_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
