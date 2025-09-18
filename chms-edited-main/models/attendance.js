export default  async function createAttendanceSchema(db) {
    const sql = `
        CREATE TABLE IF NOT EXISTS \`ATTENDANCE\` (
            attendance_id INT AUTO_INCREMENT PRIMARY KEY,
            occurrence_id INT,
            session_id INT,
            member_id INT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            source VARCHAR(100),
            FOREIGN KEY (occurrence_id) REFERENCES \`EVENT_OCCURRENCE\`(occurrence_id)
                ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (session_id) REFERENCES \`BIBLE_STUDY_SESSION\`(session_id)
                ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (member_id) REFERENCES \`MEMBER\`(member_id)
                ON DELETE CASCADE ON UPDATE CASCADE
        )
    `;
    try {
        await db.query(sql);  // ✅ No callback here
        console.log('✅ AttendanceSchema table created or already exists.');
      } catch (err) {
        console.error('❌ Error creating AttendanceSchema table:', err.message);
      }
}
