const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const username_app = 'USERNAME'; // Replace with application username
const password_app = 'PASSWORD'; // Replace with application password

const app = express();
const PORT = 3000;
const SECRET_KEY = 'SECRET_KEY'; // Hardcoded secret for student project

// Middleware
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json()); // Parse JSON bodies

// --- Database Connection ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'USERNAME',     // The user we created in the setup script
    password: 'PASSWORD', // The password we created in the setup script
    database: 'final_project_elliot'
});

db.connect(err => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
    } else {
        console.log('✅ Connected to MySQL Database');
    }
});

// --- Auth Middleware ---
// This function checks for a valid Token on protected routes
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Format is usually "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token.' });
        req.user = user;
        next();
    });
};

// --- ROUTES ---

// 1. Login Endpoint
// POST /login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Hardcoded credentials as per assignment instructions
    if (username === username_app  && password === password_app) {
        // Create a token valid for 24 hours
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ 
            message: 'Login successful', 
            token: token,
            username: username 
        });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// 2. Summary Chart Data (AI Priorities)
// GET /api/chart/summary
app.get('/api/chart/summary', verifyToken, (req, res) => {
    const sql = "SELECT goal_name as name, percentage as value FROM ai_priorities ORDER BY percentage DESC";
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// 3. Reports Chart Data (3D Printing Market)
// GET /api/chart/reports
app.get('/api/chart/reports', verifyToken, (req, res) => {
    const sql = "SELECT year, market_size_billion as value FROM printing_market_size ORDER BY year ASC";
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});