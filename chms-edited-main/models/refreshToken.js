export default async function createRefreshTokenSchema(db) {
  const sql = `
    CREATE TABLE IF NOT EXISTS \`RefreshToken\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      token TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES \`USER\`(user_id) ON DELETE CASCADE
    );
  `;

  try {
    await db.query(sql);
    console.log('✅ RefreshToken table created or already exists.');
  } catch (err) {
    console.error('❌ Error creating RefreshToken table:', err.message);
  }
}
