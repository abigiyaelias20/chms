import db from '../config/db.js';

export const createSession = (req, res) => {
    const { group_id, topic, session_date } = req.body;
    const sql = `INSERT INTO BIBLE_STUDY_SESSION (group_id, topic, session_date) VALUES (?, ?, ?)`;
    db.query(sql, [group_id, topic, session_date], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: 'Session created', data: result });
    });
};

export const getSessions = (req, res) => {
    db.query('SELECT * FROM BIBLE_STUDY_SESSION', (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ data: result });
    });
};

export const getSessionById = (req, res) => {
    db.query('SELECT * FROM BIBLE_STUDY_SESSION WHERE session_id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ data: result[0] });
    });
};

export const updateSession = (req, res) => {
    const { group_id, topic, session_date } = req.body;
    const sql = `UPDATE BIBLE_STUDY_SESSION SET group_id = ?, topic = ?, session_date = ? WHERE session_id = ?`;
    db.query(sql, [group_id, topic, session_date, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ message: 'Session updated' });
    });
};

export const deleteSession = (req, res) => {
    db.query('DELETE FROM BIBLE_STUDY_SESSION WHERE session_id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ message: 'Session deleted' });
    });
};
