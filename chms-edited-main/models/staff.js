  export default async function createStaffSchema(db) {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`STAFF\` (
        staff_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        position VARCHAR(100) NOT NULL COMMENT 'Position title of the staff member',
        ministry_id INT DEFAULT NULL COMMENT 'Null means not assigned to a ministry',
        employment_type ENUM(
          'full-time',
          'part-time',
          'volunteer'
        ) NOT NULL DEFAULT 'volunteer',
        salary DECIMAL(10, 2) DEFAULT NULL COMMENT 'Null means unpaid or volunteer',
        qualifications JSON DEFAULT NULL COMMENT 'Array of {
            type: ENUM("degree","masters","phd","certification","license"),
            name: VARCHAR(100),
            institution: VARCHAR(100),
            date_earned: DATE,
            expiration: DATE NULL COMMENT ''Null means no expiration''
            verification_id: VARCHAR(50)
          }',      
        bio TEXT DEFAULT NULL COMMENT 'Short biography of the staff member',
        emergency_contact_name VARCHAR(100) DEFAULT NULL COMMENT 'Name of emergency contact',
        emergency_contact_phone VARCHAR(20) DEFAULT NULL COMMENT 'Phone number of emergency contact',
        emergency_contact_relationship VARCHAR(50) DEFAULT NULL COMMENT 'Relationship to emergency contact',
        notes TEXT DEFAULT NULL COMMENT 'Additional notes about the staff member',
        hire_date DATE,
        end_date DATE COMMENT 'Null means currently active',
        is_active BOOLEAN DEFAULT TRUE COMMENT 'Quick filter for active staff',
        FOREIGN KEY (ministry_id) REFERENCES \`MINISTRY\`(ministry_id)
          ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (user_id) REFERENCES \`USER\`(user_id)
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `;

    try {
      await db.query(sql);
      console.log('✅ StaffSchema table created or already exists.');
    } catch (err) {
      console.error('❌ Error creating StaffSchema table:', err.message);
    }
  }
