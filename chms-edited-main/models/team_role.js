export default async function createTeamRoleSchema(db) {
    const sql = `
        CREATE TABLE IF NOT EXISTS \`TEAM_ROLE\` (
            role_id INT AUTO_INCREMENT PRIMARY KEY,
            team_id INT,
            title VARCHAR(100) NOT NULL,
            responsibilities TEXT,
            FOREIGN KEY (team_id) REFERENCES \`MINISTRY_TEAM\`(team_id)
                ON DELETE CASCADE ON UPDATE CASCADE
        )
    `;
    try {
        await db.query(sql);  // ✅ No callback here
        console.log('✅ TeamRoleSchema table created or already exists.');
      } catch (err) {
        console.error('❌ Error creating TeamRoleSchema table:', err.message);
      }
}
