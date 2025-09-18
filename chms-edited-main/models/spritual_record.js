export default async function createSpiritualRecordSchema(db) {
  const sql = `
    CREATE TABLE IF NOT EXISTS \`SPIRITUAL_RECORD\` (
      record_id INT AUTO_INCREMENT PRIMARY KEY,
      member_id INT NOT NULL,
      type VARCHAR(100),
      date DATE,
      officiant_id INT,
      CONSTRAINT fk_spiritual_member FOREIGN KEY (member_id)
        REFERENCES \`MEMBER\`(member_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_spiritual_officiant FOREIGN KEY (officiant_id)
        REFERENCES \`STAFF\`(staff_id)
        ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB;
  `;

  try {
    await db.query(sql);
    console.log('✅ SPIRITUAL_RECORD table created or already exists.');
  } catch (err) {
    console.error('❌ Error creating SPIRITUAL_RECORD table:', err.message);
  }
}
