import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(express.json()); // For parsing JSON bodies
app.use(cors()); // Enable CORS for all requests (can restrict to specific domains later)

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the MySQL database');
});

// POST route to handle form submission
app.post('/submit', async (req, res) => {
  const { name, mobile_number, location } = req.body;

  // Basic validation
  if (!name || !mobile_number || !location) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Insert user data into database
    const query = 'INSERT INTO usersrecord (name, mobile_number, location) VALUES (?, ?, ?)';
    const values = [name, mobile_number, location];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error inserting data into the database:', err);
        return res.status(500).json({ message: 'Error saving data to the database.' });
      }

      res.status(200).json({ message: 'User data saved successfully!', data: result });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An unexpected error occurred.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
