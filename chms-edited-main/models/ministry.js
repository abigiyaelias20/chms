export default async function createMinistrySchema(db) {
    const sql = `
        CREATE TABLE IF NOT EXISTS \`MINISTRY\` (
            ministry_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            type VARCHAR(100),
            description TEXT
            
        )
    `;
    try {
        await db.query(sql);  // ✅ No callback here
        console.log('✅ MinistryfSchema table created or already exists.');
      } catch (err) {
        console.error('❌ Error creating MinistrySchema table:', err.message);
      }
}
