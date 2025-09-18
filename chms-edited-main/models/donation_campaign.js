export default async function createDonationCampaignSchema(db) {
    const sql = `
        CREATE TABLE IF NOT EXISTS \`DONATION_CAMPAIGN\` (
            campaign_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            start_date DATE,
            end_date DATE,
            target_amount DECIMAL(10,2)
        )
    `;
    try {
        await db.query(sql);  // ✅ No callback here
        console.log('✅ DonationCompaignSchema table created or already exists.');
      } catch (err) {
        console.error('❌ Error creating DonationSchema table:', err.message);
      }
}
