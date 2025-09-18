export default async function createBudgetSchema(db) {
  const sql = `
    CREATE TABLE IF NOT EXISTS \`BUDGET\` (
        budget_id INT AUTO_INCREMENT PRIMARY KEY,
        ministry_id INT,
        fiscal_year YEAR,
        total_amount DECIMAL(10,2),
        approved BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (ministry_id) REFERENCES \`MINISTRY\`(ministry_id)
            ON DELETE CASCADE ON UPDATE CASCADE
    )
  `;
  try {
    await db.query(sql);  // ✅ No callback here
    console.log('✅ BudgetSchema table created or already exists.');
  } catch (err) {
    console.error('❌ Error creating BudgetSchema table:', err.message);
  }
}
