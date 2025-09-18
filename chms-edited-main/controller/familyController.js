import db from '../config/db.js';

// Create a new family
export const createFamily = (req, res) => {
    const { family_name, head_of_family, address } = req.body;
    const sql = `
        INSERT INTO FAMILY (family_name, head_of_family, address)
        VALUES (?, ?, ?)
    `;
    db.query(sql, [family_name, head_of_family, address], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating family', error: err });
        }
        res.status(201).json({ message: 'Family created successfully', data: results });
    });
};

// Get all families
export const getFamilies = (req, res) => {
    const sql = 'SELECT * FROM FAMILY';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching families', error: err });
        }
        res.status(200).json({ data: results });
    });
};

// Get a single family by ID
export const getFamilyById = (req, res) => {
    const { family_id } = req.params;
    const sql = 'SELECT * FROM FAMILY WHERE family_id = ?';
    db.query(sql, [family_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching family', error: err });
        }
        res.status(200).json({ data: results[0] });
    });
};

// Update a family
export const updateFamily = (req, res) => {
    const { family_id } = req.params;
    const { family_name, head_of_family, address } = req.body;
    const sql = `
        UPDATE FAMILY SET family_name = ?, head_of_family = ?, address = ?
        WHERE family_id = ?
    `;
    db.query(sql, [family_name, head_of_family, address, family_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating family', error: err });
        }
        res.status(200).json({ message: 'Family updated successfully' });
    });
};

// Delete a family
export const deleteFamily = (req, res) => {
    const { family_id } = req.params;
    const sql = 'DELETE FROM FAMILY WHERE family_id = ?';
    db.query(sql, [family_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting family', error: err });
        }
        res.status(200).json({ message: 'Family deleted successfully' });
    });
};
