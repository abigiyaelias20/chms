import initializeDatabase from '../config/db.js';

let db;

// Initialize DB at server start
(async () => {
    db = await initializeDatabase();
})();
// Create a new staff member
export const createStaff = async (req, res) => {
    try {
        const { 
            user_id,
            position,
            ministry_id,
            employment_type = 'volunteer',
            salary,
            qualifications,
            bio,
            emergency_contact_name,
            emergency_contact_phone,
            emergency_contact_relationship,
            notes,
            hire_date = new Date().toISOString().split('T')[0],
            end_date,
            is_active = true
        } = req.body;

        // Validate required fields
        if (!user_id || !position) {
            return res.status(400).json({ message: 'user_id and position are required' });
        }

        // Validate qualifications JSON structure if provided
        if (qualifications) {
            try {
                JSON.parse(JSON.stringify(qualifications));
            } catch (err) {
                return res.status(400).json({ message: 'Invalid qualifications format' });
            }
        }

        const sql = `
            INSERT INTO STAFF (
                user_id,
                position,
                ministry_id,
                employment_type,
                salary,
                qualifications,
                bio,
                emergency_contact_name,
                emergency_contact_phone,
                emergency_contact_relationship,
                notes,
                hire_date,
                end_date,
                is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            user_id,
            position,
            ministry_id || null,
            employment_type,
            salary || null,
            qualifications ? JSON.stringify(qualifications) : null,
            bio || null,
            emergency_contact_name || null,
            emergency_contact_phone || null,
            emergency_contact_relationship || null,
            notes || null,
            hire_date,
            end_date || null,
            is_active
        ];

        const results = await db.query(sql, params);
        
        res.status(201).json({ 
            message: 'Staff member created successfully',
            staff_id: results.insertId
        });

    } catch (err) {
        console.error('Error creating staff:', err);
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ message: 'Invalid user_id or ministry_id' });
        }
        res.status(500).json({ 
            message: 'Error creating staff member', 
            error: err.message 
        });
    }
};

// Get all staff members with optional filtering
export const getStaff = async (req, res) => {
    try {
        const { is_active, employment_type, ministry_id } = req.query;

        let sql = `
            SELECT 
                s.staff_id,
                s.user_id,
                u.first_name,
                u.last_name,
                u.email,
                s.position,
                s.ministry_id,
                m.name as ministry_name,
                s.employment_type,
                s.hire_date,
                s.salary,
                s.is_active,
                s.end_date
            FROM STAFF s
            JOIN USER u ON s.user_id = u.user_id
            LEFT JOIN MINISTRY m ON s.ministry_id = m.ministry_id
        `;

        const whereClauses = [];
        const params = [];

        if (is_active !== undefined) {
            whereClauses.push('s.is_active = ?');
            params.push(is_active === 'true' ? 1 : 0);
        }

        if (employment_type) {
            whereClauses.push('s.employment_type = ?');
            params.push(employment_type);
        }

        if (ministry_id) {
            whereClauses.push('s.ministry_id = ?');
            params.push(ministry_id);
        }

        if (whereClauses.length > 0) {
            sql += ' WHERE ' + whereClauses.join(' AND ');
        }

        sql += ' ORDER BY u.last_name, u.first_name';

        const [results] = await db.query(sql, params);
        
        // Parse qualifications JSON if needed
        const staffMembers = results.map(staff => ({
            ...staff,
            qualifications: staff.qualifications ? JSON.parse(staff.qualifications) : null
        }));

        res.status(200).json({ data: staffMembers });

    } catch (err) {
        console.error('Error fetching staff:', err);
        res.status(500).json({ 
            message: 'Error fetching staff members', 
            error: err.message 
        });
    }
};

// Get a single staff member by ID with full details
export const getStaffById = async (req, res) => {
    try {
        const { staff_id } = req.params;

        const sql = `
            SELECT 
                s.*,
                u.first_name,
                u.last_name,
                u.email,
                u.phone,
                u.address,
                m.name as ministry_name
            FROM STAFF s
            JOIN USER u ON s.user_id = u.user_id
            LEFT JOIN MINISTRY m ON s.ministry_id = m.ministry_id
            WHERE s.staff_id = ?
        `;

        const results = await db.query(sql, [staff_id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        // Parse qualifications JSON
        const staffMember = {
            ...results[0],
            qualifications: results[0].qualifications ? JSON.parse(results[0].qualifications) : null
        };

        res.status(200).json({ data: staffMember });

    } catch (err) {
        console.error('Error fetching staff member:', err);
        res.status(500).json({ 
            message: 'Error fetching staff member', 
            error: err.message 
        });
    }
};

// Update a staff member
export const updateStaff = async (req, res) => {
    try {
        const { staff_id } = req.params;
        const {
            position,
            ministry_id,
            employment_type,
            salary,
            qualifications,
            bio,
            emergency_contact_name,
            emergency_contact_phone,
            emergency_contact_relationship,
            notes,
            hire_date,
            end_date,
            is_active
        } = req.body;

        // Validate qualifications JSON structure if provided
        if (qualifications) {
            try {
                JSON.parse(JSON.stringify(qualifications));
            } catch (err) {
                return res.status(400).json({ message: 'Invalid qualifications format' });
            }
        }

        const sql = `
            UPDATE STAFF SET
                position = ?,
                ministry_id = ?,
                employment_type = ?,
                salary = ?,
                qualifications = ?,
                bio = ?,
                emergency_contact_name = ?,
                emergency_contact_phone = ?,
                emergency_contact_relationship = ?,
                notes = ?,
                hire_date = ?,
                end_date = ?,
                is_active = ?
            WHERE staff_id = ?
        `;

        const params = [
            position,
            ministry_id || null,
            employment_type,
            salary || null,
            qualifications ? JSON.stringify(qualifications) : null,
            bio || null,
            emergency_contact_name || null,
            emergency_contact_phone || null,
            emergency_contact_relationship || null,
            notes || null,
            hire_date,
            end_date || null,
            is_active,
            staff_id
        ];

        const results = await db.query(sql, params);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        res.status(200).json({ message: 'Staff member updated successfully' });

    } catch (err) {
        console.error('Error updating staff:', err);
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ message: 'Invalid ministry_id' });
        }
        res.status(500).json({ 
            message: 'Error updating staff member', 
            error: err.message 
        });
    }
};

// Delete a staff member (soft delete recommended)
export const deleteStaff = async (req, res) => {
    try {
        const { staff_id } = req.params;

        // Recommended soft delete approach:
        const sql = 'UPDATE STAFF SET is_active = FALSE WHERE staff_id = ?';
        
        // If you must hard delete:
        // const sql = 'DELETE FROM STAFF WHERE staff_id = ?';

        const results = await db.query(sql, [staff_id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        res.status(200).json({ message: 'Staff member deactivated successfully' });

    } catch (err) {
        console.error('Error deleting staff:', err);
        res.status(500).json({ 
            message: 'Error deleting staff member', 
            error: err.message 
        });
    }
};

export default {
    createStaff,
    getStaff,
    getStaffById,
    updateStaff,
    deleteStaff
};