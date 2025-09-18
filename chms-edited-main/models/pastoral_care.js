export default async function createPastoralCareSchema(db) {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`PASTORAL_CARE\` (
        case_id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT,
        counselor_id INT,
        status VARCHAR(50),
        CONSTRAINT fk_pc_member FOREIGN KEY (member_id)
          REFERENCES \`MEMBER\`(member_id)
          ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_pc_counselor FOREIGN KEY (counselor_id)
          REFERENCES \`STAFF\`(staff_id)
          ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB;
    `;
  
    try {
      await db.query(sql);
      console.log('✅ PASTORAL_CARE table created or already exists.');
    } catch (err) {
      console.error('❌ Error creating PASTORAL_CARE table:', err.message);
    }
  }
  