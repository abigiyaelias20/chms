import db from '../config/db.js';
export const createPastoralCare = (req, res) => {
    const { member_id, counselor_id, status } = req.body;
    const sql = 'INSERT INTO PASTORAL_CARE (member_id, counselor_id, status) VALUES (?, ?, ?)';
    db.query(sql, [member_id, counselor_id, status], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Pastoral care case created', caseId: result.insertId });
    });
};

export const getAllPastoralCases = (req, res) => {
    db.query('SELECT * FROM PASTORAL_CARE', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};