import db from '../config/db.js';
export const createSpiritualRecord = (req, res) => {
    const { member_id, type, date, officiant_id } = req.body;
    const sql = 'INSERT INTO SPIRITUAL_RECORD (member_id, type, date, officiant_id) VALUES (?, ?, ?, ?)';
    db.query(sql, [member_id, type, date, officiant_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Spiritual record created', recordId: result.insertId });
    });
};

export const getAllSpiritualRecords = (req, res) => {
    db.query('SELECT * FROM SPIRITUAL_RECORD', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};
