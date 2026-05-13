const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
// Add this line after app.use(express.json());
app.use('/images', express.static('public/images'));

// Initialize database
const db = new sqlite3.Database('./database/pos.db');

// Create tables
const fs = require('fs');
const initSQL = fs.readFileSync('./database/init.sql', 'utf8');
db.exec(initSQL, (err) => {
    if (err) console.error('Database init error:', err);
    else console.log('Database initialized');
});

// Test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running!', timestamp: new Date().toISOString() });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }
    db.get(
        'SELECT id, username FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, user) => {
            if (err) {
                console.error('Login error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            res.json({ 
                success: true, 
                user: { id: user.id, username: user.username } 
            });
        }
    );
});

// Get all products
app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products', (err, products) => {
        if (err) {
            console.error('Products error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(products);
    });
});

// Search products
app.get('/api/products/search', (req, res) => {
    const { q } = req.query;
    if (!q) {
        return db.all('SELECT * FROM products', (err, products) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(products);
        });
    }
    
    db.all(
        'SELECT * FROM products WHERE name LIKE ? OR product_id LIKE ?',
        [`%${q}%`, `%${q}%`],
        (err, products) => {
            if (err) {
                console.error('Search error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(products);
        }
    );
});

// Get all customers
app.get('/api/customers', (req, res) => {
    db.all('SELECT * FROM customers', (err, customers) => {
        if (err) {
            console.error('Customers error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(customers);
    });
});

// Save transaction
app.post('/api/transactions', (req, res) => {
    const { bill_number, customer_id, date_time, subtotal, discount_type, discount_value, tax, total, items_json } = req.body;
    
    db.run(
        `INSERT INTO transactions (bill_number, customer_id, date_time, subtotal, discount_type, discount_value, tax, total, items_json) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [bill_number, customer_id, date_time, subtotal, discount_type, discount_value, tax, total, JSON.stringify(items_json)],
        function(err) {
            if (err) {
                console.error('Transaction save error:', err);
                return res.status(500).json({ error: 'Failed to save transaction' });
            }
            res.json({ success: true, transaction_id: this.lastID, bill_number });
        }
    );
});

app.listen(PORT, () => {
    console.log(`✅ Backend server running on http://localhost:${PORT}`);
    console.log(`📍 API endpoints:`);
    console.log(`   - GET  http://localhost:${PORT}/api/health`);
    console.log(`   - POST http://localhost:${PORT}/api/login`);
    console.log(`   - GET  http://localhost:${PORT}/api/products`);
    console.log(`   - GET  http://localhost:${PORT}/api/products/search?q=`);
    console.log(`   - GET  http://localhost:${PORT}/api/customers`);
    console.log(`   - POST http://localhost:${PORT}/api/transactions`);
});
