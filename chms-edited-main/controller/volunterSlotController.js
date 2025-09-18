import db from '../config/db.js';
export const createVolunteerSlot = (req, res) => {
    const { occurrence_id, role_type, required_people } = req.body;
    const sql = 'INSERT INTO VOLUNTEER_SLOT (occurrence_id, role_type, required_people) VALUES (?, ?, ?)';
    db.query(sql, [occurrence_id, role_type, required_people], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Volunteer slot created', slotId: result.insertId });
    });
};

export const getAllVolunteerSlots = (req, res) => {
    db.query('SELECT * FROM VOLUNTEER_SLOT', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};

