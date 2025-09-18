export default async function createMemberSchema(db) {
  const sql = `
    CREATE TABLE IF NOT EXISTS \`MEMBER\` (
      member_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT UNIQUE NOT NULL,
      
      -- Core Member Information
      join_date DATE DEFAULT NULL,
      membership_status ENUM(
        'visitor',
        'new_member',
        'active',
        'inactive',
        'transferred'
      ) DEFAULT 'visitor',
      baptism_date DATE NULL,
      
      -- Family Information
      family_id INT DEFAULT NULL,
      family_relationship ENUM(
        'head',
        'spouse',
        'child',
        'parent',
        'sibling',
        'other'
      ) DEFAULT NULL,
      
      -- Team Participation (with JSON validation)
      team_participation JSON DEFAULT NULL COMMENT 'Array of {
        team_id: INT REFERENCES TEAM(team_id),
        role: ENUM("member","leader","coordinator") DEFAULT "member",
        join_date: DATE,
        end_date: DATE NULL COMMENT "Null means currently active",
        is_active BOOLEAN DEFAULT TRUE
      }',
      
      -- Other fields remain the same...
      spiritual_gifts SET(
        'teaching', 'worship', 'outreach', 'administration',
        'hospitality', 'prayer', 'counseling', 'technical'
      ) DEFAULT NULL,
      
      event_participation JSON DEFAULT NULL COMMENT 'Array of {
        event_id: INT REFERENCES EVENT(event_id),
        role: ENUM("attendee","volunteer","coordinator") DEFAULT "attendee",
        join_date: DATE,
        end_date: DATE NULL COMMENT "Null means currently active",
        feedback TEXT
      }',

      notes TEXT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      
      FOREIGN KEY (user_id) REFERENCES \`USER\`(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (family_id) REFERENCES \`FAMILY\`(family_id)
        ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  try {
    await db.query(sql);
    console.log('✅ Enhanced unified member table created');

    // Add trigger for team_participation validation
    await db.query(`
  CREATE TRIGGER validate_team_participation
  BEFORE INSERT ON \`MEMBER\`
  FOR EACH ROW
  BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE team_count INT;
    DECLARE team_id_val INT;

    IF NEW.team_participation IS NOT NULL THEN
      SET team_count = JSON_LENGTH(NEW.team_participation);

      WHILE i < team_count DO
        SET team_id_val = JSON_EXTRACT(NEW.team_participation, CONCAT('$[', i, '].team_id'));

        IF NOT EXISTS (SELECT 1 FROM \`TEAM\` WHERE team_id = team_id_val) THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'Invalid team_id in team_participation array';
        END IF;

        IF JSON_UNQUOTE(JSON_EXTRACT(NEW.team_participation, CONCAT('$[', i, '].role')))
           NOT IN ('member', 'leader', 'volunteer', 'coordinator') THEN
          SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'Invalid role in team_participation array';
        END IF;

        SET i = i + 1;
      END WHILE;
    END IF;
  END
`);


    console.log('✅ Team participation validation trigger added');

  } catch (err) {
    console.error('❌ Error creating enhanced member table:', err.message);
    throw err;
  }
}