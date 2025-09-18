export default async function createUserSchema(db) {
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
      status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active'
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;

  try {
    await db.query(sql);
    console.log('✅ UserSchema table created or already exists.');
  } catch (err) {
    console.error('❌ Error creating UserSchema table:', err.message);
  }
}
