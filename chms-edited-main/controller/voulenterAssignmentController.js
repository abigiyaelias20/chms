import db from '../config/db.js';
export const createVolunteerAssignment = (req, res) => {
    const { slot_id, member_id, status, check_in_time } = req.body;
    const sql = 'INSERT INTO VOLUNTEER_ASSIGNMENT (slot_id, member_id, status, check_in_time) VALUES (?, ?, ?, ?)';
    db.query(sql, [slot_id, member_id, status, check_in_time], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Volunteer assignment created', assignmentId: result.insertId });
    });
};

export const getAllVolunteerAssignments = (req, res) => {
    db.query('SELECT * FROM VOLUNTEER_ASSIGNMENT', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};
