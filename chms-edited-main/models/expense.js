export default async function createExpenseSchema(db) {
    const sql = `
      CREATE TABLE IF NOT EXISTS \`EXPENSE\` (
        expense_id INT AUTO_INCREMENT PRIMARY KEY,
        budget_id INT NOT NULL,
        description TEXT,
        amount DECIMAL(10,2),
        vendor VARCHAR(255),
        approval_status VARCHAR(50),
        FOREIGN KEY (budget_id) REFERENCES \`BUDGET\`(budget_id)
          ON DELETE CASCADE ON UPDATE CASCADE
      );
    `;
  
    try {
      await db.query(sql);
      console.log('✅ EXPENSE table created or already exists.');
    } catch (err) {
      console.error('❌ Error creating EXPENSE table:', err.message);
    }
  }
  