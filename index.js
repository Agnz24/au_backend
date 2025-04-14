import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse incoming JSON requests

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // Increase timeout (default is 10000ms)
  acquireTimeout: 10000, 
});

// Route to handle form submission
app.post("/submit", (req, res) => {
  const { name, mobile_number, location } = req.body;

  // SQL query to insert data into the usersrecord table
  const query = "INSERT INTO usersrecord (name, mobile_number, location) VALUES (?, ?, ?)";

  // Execute the query using the connection pool
  pool.query(query, [name, mobile_number, location], (err, result) => {
    if (err) {
      console.error("Error inserting data into the database: " + err.stack);
      return res.status(500).json({ message: "Failed to insert data" });
    }

    // Success response
    res.status(200).json({ message: "Data inserted successfully", result });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
