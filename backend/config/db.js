const mysql = require("mysql2");
const fs = require("fs");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,

  ssl: {
    ca: fs.readFileSync("/etc/secrets/ca.pem"),
  },
});

connection.connect((err) => {
  if (err) {
    console.log("Database Error", err);
    return;
  }

  console.log("MySQL Connected");

  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    )
  `;

  const tripsTable = `
    CREATE TABLE IF NOT EXISTS trips (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      trip_name VARCHAR(80) NOT NULL,
      destination VARCHAR(60) NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      budget DECIMAL(12,2) NOT NULL,

      FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    )
  `;

  const expensesTable = `
    CREATE TABLE IF NOT EXISTS expenses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      trip_id INT NOT NULL,
      category VARCHAR(100) NOT NULL,
      amount DECIMAL(12,2) NOT NULL,
      expense_date DATE NOT NULL,

      FOREIGN KEY (trip_id)
        REFERENCES trips(id)
        ON DELETE CASCADE
    )
  `;

  connection.query(usersTable, (err) => {
    if (err) {
      console.log("Users table error:", err);
      return;
    }

    console.log("Users table ready");

    connection.query(tripsTable, (err) => {
      if (err) {
        console.log("Trips table error:", err);
        return;
      }

      console.log("Trips table ready");

      connection.query(expensesTable, (err) => {
        if (err) {
          console.log("Expenses table error:", err);
          return;
        }

        console.log("Expenses table ready");
      });
    });
  });
});

module.exports = connection;