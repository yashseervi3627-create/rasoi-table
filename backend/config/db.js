const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Yash@2007",
  database: "rasoihub",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;