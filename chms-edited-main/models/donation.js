export default async function createDonationSchema(db) {
  const sql = `
    CREATE TABLE IF NOT EXISTS \`DONATION\` (
      donation_id INT AUTO_INCREMENT PRIMARY KEY,
      member_id INT NULL,
      amount DECIMAL(10,2),
      date DATE,
      payment_method VARCHAR(50),
      is_recurring BOOLEAN DEFAULT FALSE,
      campaign_id INT NULL,
      CONSTRAINT fk_donation_member FOREIGN KEY (member_id)
        REFERENCES \`MEMBER\`(member_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
      CONSTRAINT fk_donation_campaign FOREIGN KEY (campaign_id)
        REFERENCES \`DONATION_CAMPAIGN\`(campaign_id)
        ON DELETE SET NULL ON UPDATE CASCADE
    ) ENGINE=InnoDB;
  `;

  try {
    await db.query(sql);
    console.log('✅ DONATION table created or already exists.');
  } catch (err) {
    console.error('❌ Error creating DONATION table:', err.message);
  }
}
