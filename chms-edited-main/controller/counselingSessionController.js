import db from '../config/db.js';

export const createCounseling = (req, res) => {
    const { member_id, counselor_id, session_date, topic, notes } = req.body;
    const sql = `INSERT INTO COUNSELING_SESSION (member_id, counselor_id, session_date, topic, notes) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [member_id, counselor_id, session_date, topic, notes], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: 'Counseling session recorded', data: result });
    });
};

export const getCounselings = (req, res) => {
    db.query('SELECT * FROM COUNSELING_SESSION', (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ data: result });
    });
};

export const getCounselingById = (req, res) => {
    db.query('SELECT * FROM COUNSELING_SESSION WHERE session_id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ data: result[0] });
    });
};

export const updateCounseling = (req, res) => {
    const { member_id, counselor_id, session_date, topic, notes } = req.body;
    const sql = `UPDATE COUNSELING_SESSION SET member_id = ?, counselor_id = ?, session_date = ?, topic = ?, notes = ? WHERE session_id = ?`;
    db.query(sql, [member_id, counselor_id, session_date, topic, notes, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ message: 'Counseling session updated' });
    });
};

export const deleteCounseling = (req, res) => {
    db.query('DELETE FROM COUNSELING_SESSION WHERE session_id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ message: 'Counseling session deleted' });
    });
};
