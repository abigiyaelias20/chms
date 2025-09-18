import db from '../config/db.js';

export const createDonation = (req, res) => {
    const { member_id, amount, donation_date, purpose } = req.body;
    const sql = `INSERT INTO DONATION (member_id, amount, donation_date, purpose) VALUES (?, ?, ?, ?)`;
    db.query(sql, [member_id, amount, donation_date, purpose], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: 'Donation recorded', data: result });
    });
};

export const getDonations = (req, res) => {
    db.query('SELECT * FROM DONATION', (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ data: result });
    });
};

export const getDonationById = (req, res) => {
    db.query('SELECT * FROM DONATION WHERE donation_id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ data: result[0] });
    });
};

export const updateDonation = (req, res) => {
    const { member_id, amount, donation_date, purpose } = req.body;
    const sql = `UPDATE DONATION SET member_id = ?, amount = ?, donation_date = ?, purpose = ? WHERE donation_id = ?`;
    db.query(sql, [member_id, amount, donation_date, purpose, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ message: 'Donation updated' });
    });
};

export const deleteDonation = (req, res) => {
    db.query('DELETE FROM DONATION WHERE donation_id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ message: 'Donation deleted' });
    });
};
