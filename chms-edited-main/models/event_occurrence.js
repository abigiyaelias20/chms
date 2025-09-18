export default async function createEventOccurrenceSchema(db) {
    const sql = `
        CREATE TABLE IF NOT EXISTS \`EVENT_OCCURRENCE\` (
            occurrence_id INT AUTO_INCREMENT PRIMARY KEY,
            event_id INT,
            start_time DATETIME,
            end_time DATETIME,
            location VARCHAR(255),
            FOREIGN KEY (event_id) REFERENCES \`EVENT\`(event_id)
                ON DELETE CASCADE ON UPDATE CASCADE
        )
    `;
    try {
        await db.query(sql);  // ✅ No callback here
        console.log('✅ EventOccurrenceSchema table created or already exists.');
      } catch (err) {
        console.error('❌ Error creating EventOccurenceSchema table:', err.message);
      }
}
