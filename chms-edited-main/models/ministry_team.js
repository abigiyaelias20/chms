export default async function createMinistryTeamSchema(db) {
    const sql = `
        CREATE TABLE IF NOT EXISTS \`MINISTRY_TEAM\` (
            team_id INT AUTO_INCREMENT PRIMARY KEY,
            ministry_id INT,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            meeting_schedule VARCHAR(255),
            FOREIGN KEY (ministry_id) REFERENCES \`MINISTRY\`(ministry_id)
                ON DELETE CASCADE ON UPDATE CASCADE
        )
    `;
    try {
        await db.query(sql);  // ✅ No callback here
        console.log('✅ MinistryTeamSchema table created or already exists.');
      } catch (err) {
        console.error('❌ Error creating MinistryTeamSchema table:', err.message);
      }
    }