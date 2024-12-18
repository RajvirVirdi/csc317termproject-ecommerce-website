const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt'); // To securely hash passwords
const path = require('path');
const cors = require('cors'); // Enable cross-origin resource sharing

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
const db = new sqlite3.Database('./private/db/database.db', (err) => {
    if (err) {
        console.error('Failed to connect to database:', err.message);
    } else {
        console.log('Connected to SQLite database');

        // Create 'users' table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )`);

        // Create 'products' table
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            image_url TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Error creating products table:', err.message);
            } else {
                console.log('Products table created successfully.');

                // Check if 'products' table is empty before inserting sample data
                db.get('SELECT COUNT(*) AS count FROM products', (err, row) => {
                    if (err) {
                        console.error('Error checking products table:', err.message);
                    } else if (row.count === 0) {
                        db.run(`INSERT INTO products (name, description, price, image_url) VALUES 
                            ('Fenmore Multifunction Black Stainless Steel Watch', 'Stylish black stainless steel watch for men.', 299, 'https://fossil.scene7.com/is/image/FossilPartners/BQ2365_main?$sfcc_fos_medium$'),
                            ('Men''s Gold Contour Case Remote Sweep Leather Watch', 'Elegant gold leather watch for men.', 399, 'https://www.peugeotwatches.com/cdn/shop/products/2039G-FV_2048x.jpg?v=1630521201'),
                            ('Men''s Patek Philippe Aquanaut Rose Gold', 'Luxury Patek Philippe Aquanaut with rose gold finish.', 899, 'https://content.thewosgroup.com/productimage/17921105/17921105_1.jpg?impolicy=lister'),
                            ('Mibro Lite Smart Watch', 'Waterproof IP68 smart watch with advanced features.', 199, 'https://s.alicdn.com/@sc04/kf/He5d6cc646f494c82abb2b6b0b229648bR.jpg_720x720q50.jpg'),
                            'Luxury Watch', 'A premium luxury watch with elegant design.', 899, '../images/luxurywatch.png'),
                            ('Smart Watch', 'A modern smart watch with advanced features.', 899, '../images/smartwatch.png')`,
                            
                            (err) => {
                                if (err) {
                                    console.error('Error inserting products:', err.message);
                                } else {
                                    console.log('Sample products inserted successfully.');
                                }
                            });
                    } else {
                        console.log('Products table already contains data.');
                    }
                });
            }
        });
    }
});

// API Endpoints

// Signup Endpoint
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.run(sql, [username, email, hashedPassword], function (err) {
            if (err) {
                console.error(err.message);
                return res.status(400).json({ error: 'Email already exists.' });
            }
            res.status(201).json({ message: 'Account created successfully!' });
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], async (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        try {
            const validPassword = await bcrypt.compare(password, user.password);
            if (validPassword) {
                res.status(200).json({ message: 'Login successful!', username: user.username });
            } else {
                res.status(400).json({ error: 'Invalid email or password' });
            }
        } catch (error) {
            console.error('Error:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});

// Fetch all products
app.get('/api/products', (req, res) => {
    const sql = 'SELECT * FROM products';

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching products:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve products' });
        }
        res.status(200).json(rows);
    });
});

// Default route - Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
