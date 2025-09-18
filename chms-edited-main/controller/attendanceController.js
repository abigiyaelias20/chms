import db from '../config/db.js';

export const createAttendance = (req, res) => {
    const { member_id, event_id, status } = req.body;
    const sql = `INSERT INTO ATTENDANCE (member_id, event_id, status) VALUES (?, ?, ?)`;
    db.query(sql, [member_id, event_id, status], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error adding attendance', error: err });
        res.status(201).json({ message: 'Attendance recorded', data: result });
    });
};

export const getAllAttendance = (req, res) => {
    db.query('SELECT * FROM ATTENDANCE', (err, result) => {
        if (err) return res.status(500).json({ message: 'Error fetching attendance', error: err });
        res.status(200).json({ data: result });
    });
};

export const getAttendanceById = (req, res) => {
    db.query('SELECT * FROM ATTENDANCE WHERE attendance_id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ data: result[0] });
    });
};

export const updateAttendance = (req, res) => {
    const { member_id, event_id, status } = req.body;
    const sql = `UPDATE ATTENDANCE SET member_id = ?, event_id = ?, status = ? WHERE attendance_id = ?`;
    db.query(sql, [member_id, event_id, status, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ message: 'Attendance updated' });
    });
};

export const deleteAttendance = (req, res) => {
    db.query('DELETE FROM ATTENDANCE WHERE attendance_id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ message: 'Attendance deleted' });
    });
};
