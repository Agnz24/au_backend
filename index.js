import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Create a MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to database.");
});

// Route to handle form submissions
app.post("/submit", (req, res) => {
  const { name, mobile_number, location } = req.body;

  if (!name || !mobile_number || !location) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const sql = "INSERT INTO usersrecord (Name, `Phone Number`, Location) VALUES (?, ?, ?)";
  db.query(sql, [name, mobile_number, location], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ message: "Database error." });
    }
    res.status(200).json({ message: "Data inserted successfully." });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
