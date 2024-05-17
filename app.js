const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sivashiv2000@',
    database: 'moviesdb'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database as id ' + connection.threadId);
});

// Create the movies table if it doesn't exist
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS movies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        img VARCHAR(255) NOT NULL,
        summary TEXT NOT NULL
    )
`;

connection.query(createTableQuery, (err, results, fields) => {
    if (err) {
        console.error('Error creating movies table: ' + err.stack);
        return;
    }
    console.log('Movies table created or already exists');
});

// CRUD routes
// Create a new movie
app.post('/movies', (req, res) => {
    const { name, img, summary } = req.body;
    const query = 'INSERT INTO movies (name, img, summary) VALUES (name, img, summary)';
    connection.query(query, [name, img, summary], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(201).json({ id: results.insertId, name, img, summary });
    });
});

// Read all movies
app.get('/movies', (req, res) => {
    const query = 'SELECT * FROM movies';
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});

// Read a single movie
app.get('/movies/:movieId', (req, res) => {
    const query = 'SELECT * FROM movies WHERE id = ?';
    connection.query(query, [req.params.movieId], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: 'Movie not found' });
            return;
        }
        res.json(results[0]);
    });
});

// Update a movie
app.put('/movies/:movieId', (req, res) => {
    const { name, img, summary } = req.body;
    const query = 'UPDATE movies SET name = ?, img = ?, summary = ? WHERE id = ?';
    connection.query(query, [name, img, summary, req.params.movieId], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Movie not found' });
            return;
        }
        res.json({ id: req.params.movieId, name, img, summary });
    });
});

// Delete a movie
app.delete('/movies/:movieId', (req, res) => {
    const query = 'DELETE FROM movies WHERE id = ?';
    connection.query(query, [req.params.movieId], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Movie not found' });
            return;
        }
        res.sendStatus(204);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});





