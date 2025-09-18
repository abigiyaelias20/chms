export default async function createBibleStudyMembershipSchema(db) {
  const sql = `
    CREATE TABLE IF NOT EXISTS \`BIBLE_STUDY_MEMBERSHIP\` (
        membership_id INT AUTO_INCREMENT PRIMARY KEY,
        group_id INT,
        member_id INT,
        join_date DATE,
        role ENUM('Member', 'Apprentice', 'Leader') DEFAULT 'Member',
        FOREIGN KEY (group_id) REFERENCES \`BIBLE_STUDY_GROUP\`(group_id)
            ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (member_id) REFERENCES \`MEMBER\`(member_id)
            ON DELETE CASCADE ON UPDATE CASCADE
    )
  `;
  try {
    await db.query(sql);  // ✅ No callback here
    console.log('✅ BibleStudyMembershipSchema table created or already exists.');
  } catch (err) {
    console.error('❌ Error creating BibleStudyMembershipSchema table:', err.message);
  }
}
