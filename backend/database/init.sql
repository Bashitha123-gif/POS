-- Users table (hardcoded credentials)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- Insert hardcoded credentials
INSERT OR IGNORE INTO users (username, password) VALUES 
('cashier', 'cashier123'),
('manager', 'manager456');

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    image_path TEXT
);

-- Insert dummy products
INSERT OR IGNORE INTO products (product_id, name, unit_price, image_path) VALUES 
('P001', 'Laptop Bag', 2500.00, '/images/products/bag.jpg'),
('P002', 'Wireless Mouse', 1500.00, '/images/products/mouse.jpg'),
('P003', 'USB Cable', 500.00, '/images/products/usb.jpg'),
('P004', 'Notebook', 250.00, '/images/products/notebook.jpg'),
('P005', 'Pen Set', 350.00, '/images/products/pen.jpg');

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT
);

-- Insert dummy customers
INSERT OR IGNORE INTO customers (name, phone, email) VALUES 
('Walk-in Customer', '0000000000', 'walkin@store.com'),
('John Doe', '0771234567', 'john@email.com'),
('Jane Smith', '0777654321', 'jane@email.com');

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bill_number TEXT UNIQUE NOT NULL,
    customer_id INTEGER,
    date_time TEXT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    discount_type TEXT,
    discount_value DECIMAL(10,2),
    tax DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    items_json TEXT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);