const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT), // 🔥 IMPORTANT
  ssl: {
    rejectUnauthorized: false
  },
  connectTimeout: 30000
});

db.connect(err => {
  if (err) {
    console.error("❌ DB connection failed:", err.message);
    return; // ❌ never throw in production
  }
  console.log("✅ MySQL Connected (Aiven)");
});

module.exports = db;
