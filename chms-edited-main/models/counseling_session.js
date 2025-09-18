export default async function createPastoralCareSchema(db) {
  const sql = `
    CREATE TABLE IF NOT EXISTS \`PASTORAL_CARE\` (
        case_id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT,
        issue TEXT,
        status VARCHAR(50),
        created_at DATETIME,
        FOREIGN KEY (member_id) REFERENCES \`MEMBER\`(member_id)
            ON DELETE CASCADE ON UPDATE CASCADE
    )
  `;
  try {
    await db.query(sql);
    console.log('✅ PastoralCareSchema table created or already exists.');
  } catch (err) {
    console.error('❌ Error creating PastoralCareSchema table:', err.message);
  }
}
