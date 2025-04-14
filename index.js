import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Test DB Connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    process.exit();
  } else {
    console.log('Connected to the database');
  }
});

// Route to handle form submission
app.post('/submit', (req, res) => {
  const { name, mobile_number, location } = req.body;

  if (!name || !mobile_number || !location) {
    return res.status(400).send({ message: 'All fields are required.' });
  }

  // SQL query to insert the data
  const query = 'INSERT INTO usersrecord (name, mobile_number, location) VALUES (?, ?, ?)';

  db.query(query, [name, mobile_number, location], (err, result) => {
    if (err) {
      console.error('Error inserting data into the database: ', err);
      return res.status(500).send({ message: 'Error inserting data into the database.' });
    }

    console.log('Data inserted successfully:', result);
    res.status(200).send({ message: 'Details submitted successfully!' });
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
