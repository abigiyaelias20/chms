export default async function createBibleStudySessionSchema(db) {
  const sql = `
    CREATE TABLE IF NOT EXISTS \`BIBLE_STUDY_SESSION\` (
        session_id INT AUTO_INCREMENT PRIMARY KEY,
        group_id INT,
        date DATETIME,
        topic VARCHAR(255),
        leader_id INT,
        FOREIGN KEY (group_id) REFERENCES \`BIBLE_STUDY_GROUP\`(group_id)
            ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (leader_id) REFERENCES \`STAFF\`(staff_id)
            ON DELETE SET NULL ON UPDATE CASCADE
    )
  `;
  try {
    await db.query(sql);
    console.log('✅ BibleStudySessionSchema table created or already exists.');
  } catch (err) {
    console.error('❌ Error creating BibleStudySessionSchema table:', err.message);
  }
}
