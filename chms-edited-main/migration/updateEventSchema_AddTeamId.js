import initializeDatabase from '../config/db.js';

export default async function updateEventSchema_AddTeamId() {
  const db = await initializeDatabase(); // ensures db is ready before use

  const addTeamIdColumnSQL = `
    ALTER TABLE \`EVENT\`
    ADD COLUMN team_id INT DEFAULT NULL,
    ADD CONSTRAINT fk_team_id FOREIGN KEY (team_id)
      REFERENCES \`MINISTRY_TEAM\`(team_id)
      ON DELETE SET NULL ON UPDATE CASCADE;
  `;

  try {
    await db.query(addTeamIdColumnSQL);
    console.log('✅ team_id column and foreign key added to EVENT table.');
  } catch (err) {
    if (
      err.message.includes('Duplicate column name') ||
      err.message.includes('Duplicate foreign key')
    ) {
      console.log('ℹ️ team_id column or foreign key already exists. Skipping update.');
    } else {
      console.error('❌ Error updating EVENT table:', err.message);
    }
  }
}
