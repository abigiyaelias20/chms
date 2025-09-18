export default async function createVolunteerAssignmentSchema(db) {
  const sql = `
    CREATE TABLE IF NOT EXISTS \`VOLUNTEER_ASSIGNMENT\` (
      assignment_id INT AUTO_INCREMENT PRIMARY KEY,
      slot_id INT NOT NULL,
      member_id INT NOT NULL,
      status VARCHAR(50),
      check_in_time DATETIME,
      CONSTRAINT fk_slot_id FOREIGN KEY (slot_id)
        REFERENCES \`VOLUNTEER_SLOT\`(slot_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_member_id FOREIGN KEY (member_id)
        REFERENCES \`MEMBER\`(member_id)
        ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB;
  `;

  try {
    await db.query(sql);
    console.log('✅ VOLUNTEER_ASSIGNMENT table created or already exists.');
  } catch (err) {
    console.error('❌ Error creating VOLUNTEER_ASSIGNMENT table:', err.message);
  }
}
