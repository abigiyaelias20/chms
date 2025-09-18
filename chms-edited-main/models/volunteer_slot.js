export default async function createVolunteerSlotSchema(db) {
    const sql = `
        CREATE TABLE IF NOT EXISTS \`VOLUNTEER_SLOT\` (
            slot_id INT AUTO_INCREMENT PRIMARY KEY,
            occurrence_id INT,
            role_type VARCHAR(100),
            required_people INT,
            FOREIGN KEY (occurrence_id) REFERENCES \`EVENT_OCCURRENCE\`(occurrence_id)
                ON DELETE CASCADE ON UPDATE CASCADE
        )
    `;
    try {
        await db.query(sql);  // ✅ No callback here
        console.log('✅ VolunteerSlotSchema table created or already exists.');
      } catch (err) {
        console.error('❌ Error creating VolunteerSlotSchema table:', err.message);
      }
}
