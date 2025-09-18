export default async function createEventSchema(db) {
  const createEventSQL = `
    CREATE TABLE IF NOT EXISTS \`EVENT\` (
        event_id INT AUTO_INCREMENT PRIMARY KEY,
        ministry_id INT NOT NULL,
        team_id INT DEFAULT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        start_date DATETIME NOT NULL,
        end_date DATETIME DEFAULT NULL,
        location VARCHAR(255) DEFAULT NULL,
        recurrence_pattern VARCHAR(100) DEFAULT NULL,
        status ENUM('Planned', 'Active', 'Cancelled', 'Completed') NOT NULL DEFAULT 'Planned',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (ministry_id) REFERENCES \`MINISTRY\`(ministry_id)
            ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (team_id) REFERENCES \`MINISTRY_TEAM\`(team_id)
            ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  try {
    await db.query(createEventSQL);
    console.log('✅ Event table created or already exists.');
  } catch (err) {
    console.error('❌ Error creating Event table:', err.message);
  }
}