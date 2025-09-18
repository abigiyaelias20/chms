export default async  function createFamilySchema(db) {
    const sql = `
        CREATE TABLE IF NOT EXISTS \`FAMILY\` (
            family_id INT AUTO_INCREMENT PRIMARY KEY,
            family_name VARCHAR(255) NOT NULL,
            head_of_family INT,
            address TEXT
        )
    `;
    try {
        await db.query(sql);  // ✅ No callback here
        console.log('✅ FamilySchema table created or already exists.');
      } catch (err) {
        console.error('❌ Error creating FamilySchema table:', err.message);
      }
}
