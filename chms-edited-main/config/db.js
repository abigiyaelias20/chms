import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const initializeDatabase = async () => {
  try {
    const {
      DB_HOST = "localhost",
      DB_PORT = 3306,
      DB_USER = "root",
      DB_PASSWORD = "",
      DB_NAME = "chms_database_new",
      ADMIN_EMAIL = "abigiya@church.com",
      ADMIN_PASSWORD = "abigu@123"
    } = process.env;

    // Connect and create database (existing code remains the same)
    const tempConnection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD
    });

    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`Database "${DB_NAME}" created or already exists`);
    await tempConnection.end();

    const dbConnection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      multipleStatements: true
    });

    console.log("Connected to the database successfully");

    // Create tables (existing code remains the same)
    await createTables(dbConnection);

    // Enhanced admin seeding with proper password hashing
    await seedAdminUser(dbConnection, ADMIN_EMAIL, ADMIN_PASSWORD);

    return dbConnection;

  } catch (err) {
    console.error("Database initialization failed:", err);
    throw err;
  }
};

async function createTables(db) {
  const sql = `
    CREATE TABLE IF NOT EXISTS \`USER\` (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      date_of_birth DATE,
      phone VARCHAR(20),
      address TEXT,
      user_type ENUM('Member', 'Staff', 'Admin') NOT NULL,
      last_login DATETIME DEFAULT NULL,
      status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
  await db.query(sql);
  console.log("✅ USER table created or already exists");
}

async function seedAdminUser(db, email, password) {
  try {
    const [adminUsers] = await db.query(
      "SELECT user_id FROM USER WHERE user_type = 'Admin' LIMIT 1"
    );

    if (adminUsers.length === 0) {
      // Generate salt and hash the password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      
      await db.query(
        `INSERT INTO USER (
          email, 
          password_hash, 
          first_name, 
          last_name, 
          user_type,
          phone,
          address,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          email,
          passwordHash,
          'Church',
          'Administrator',
          'Admin',
          '+1234567890',
          '123 Church Street, Admin City',
          'Active'
        ]
      );
      console.log("Admin user seeded successfully");
      console.log(`Email: ${email}`);
      console.log(`Initial Password: ${password}`);
      console.log("Change these credentials immediately after first login!");
    } else {
      console.log("ℹAdmin user already exists, skipping seeding");
    }
  } catch (err) {
    console.error("Failed to seed admin user:", err.message);
  }
}

export default initializeDatabase;