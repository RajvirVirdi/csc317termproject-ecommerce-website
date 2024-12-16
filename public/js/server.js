const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// SQLite Database setup
//const db = new sqlite3.Database('./private/database.sqlite', (err) => {
//    if (err) console.error(err.message);
//    console.log('Connected to SQLite database.');
//});

// Render basic HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
