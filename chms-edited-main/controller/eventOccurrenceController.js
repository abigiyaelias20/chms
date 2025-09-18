import db from '../config/db.js';

export const createOccurrence = (req, res) => {
    const { event_id, start_time, end_time, location } = req.body;
    const sql = 'INSERT INTO EVENT_OCCURRENCE (event_id, start_time, end_time, location) VALUES (?, ?, ?, ?)';
    db.query(sql, [event_id, start_time, end_time, location], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Occurrence created', occurrenceId: result.insertId });
    });
};

export const getAllOccurrences = (req, res) => {
    db.query('SELECT * FROM EVENT_OCCURRENCE', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};
