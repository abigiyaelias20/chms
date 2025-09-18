export default async  function createBibleStudyGroupSchema(db) {
    const sql = `
        CREATE TABLE IF NOT EXISTS \`BIBLE_STUDY_GROUP\` (
            group_id INT AUTO_INCREMENT PRIMARY KEY,
            ministry_id INT,
            name VARCHAR(255) NOT NULL,
            curriculum TEXT,
            meeting_time VARCHAR(255),
            location VARCHAR(255),
            leader_id INT,
            max_capacity INT,
            FOREIGN KEY (ministry_id) REFERENCES \`MINISTRY\`(ministry_id)
                ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (leader_id) REFERENCES \`MEMBER\`(member_id)
                ON DELETE SET NULL ON UPDATE CASCADE
        )
    `;
    try {
        await db.query(sql);  // ✅ No callback here
        console.log('✅ BibleStudyGroupSchema table created or already exists.');
      } catch (err) {
        console.error('❌ Error creating EventSchema table:', err.message);
      }
}
