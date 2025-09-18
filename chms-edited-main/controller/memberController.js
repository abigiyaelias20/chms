import initializeDatabase from '../config/db.js';

let db;

// Initialize DB at server start
(async () => {
    db = await initializeDatabase();
})();
// Create a new member
export const createMember = async (req, res) => {
    try {
        const {
            user_id,
            join_date = new Date().toISOString().split('T')[0],
            membership_status = 'visitor',
            baptism_date,
            family_id,
            family_relationship,
            team_participation,
            spiritual_gifts,
            event_participation,
            notes
        } = req.body;

        // Validate required fields
        if (!user_id) {
            return res.status(400).json({ message: 'user_id is required' });
        }

        // Validate JSON fields if provided
        if (team_participation) {
            try {
                JSON.parse(JSON.stringify(team_participation));
            } catch (err) {
                return res.status(400).json({ message: 'Invalid team_participation format' });
            }
        }

        if (event_participation) {
            try {
                JSON.parse(JSON.stringify(event_participation));
            } catch (err) {
                return res.status(400).json({ message: 'Invalid event_participation format' });
            }
        }

        const sql = `
            INSERT INTO MEMBER (
                user_id,
                join_date,
                membership_status,
                baptism_date,
                family_id,
                family_relationship,
                team_participation,
                spiritual_gifts,
                event_participation,
                notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            user_id,
            join_date,
            membership_status,
            baptism_date || null,
            family_id || null,
            family_relationship || null,
            team_participation ? JSON.stringify(team_participation) : null,
            spiritual_gifts || null,
            event_participation ? JSON.stringify(event_participation) : null,
            notes || null
        ];

        const result = await db.query(sql, params);

        res.status(201).json({
            message: 'Member created successfully',
            member_id: result.insertId
        });


    } catch (err) {
        console.error('Error creating member:', err);
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ message: 'Invalid user_id or family_id' });
        }
        res.status(500).json({
            message: 'Error creating member',
            error: err.message
        });
    }
};

// Get all members with optional filtering
export const getMembers = async (req, res) => {
    try {
        const { membership_status, family_id, has_team } = req.query;

        let sql = `
            SELECT 
                m.member_id,
                m.user_id,
                u.first_name,
                u.last_name,
                u.email,
                u.phone,
                m.membership_status,
                m.join_date,
                m.baptism_date,
                m.family_id,
                f.family_name,
                m.spiritual_gifts
            FROM MEMBER m
            JOIN USER u ON m.user_id = u.user_id
            LEFT JOIN FAMILY f ON m.family_id = f.family_id
        `;

        const whereClauses = [];
        const params = [];

        if (membership_status) {
            whereClauses.push('m.membership_status = ?');
            params.push(membership_status);
        }

        if (family_id) {
            whereClauses.push('m.family_id = ?');
            params.push(family_id);
        }

        if (has_team === 'true') {
            whereClauses.push('JSON_LENGTH(m.team_participation) > 0');
        } else if (has_team === 'false') {
            whereClauses.push('(m.team_participation IS NULL OR JSON_LENGTH(m.team_participation) = 0)');
        }

        if (whereClauses.length > 0) {
            sql += ' WHERE ' + whereClauses.join(' AND ');
        }

        sql += ' ORDER BY u.last_name, u.first_name';

        const [results] = await db.query(sql, params);

        // Parse JSON fields if needed
        const members = results.map(member => ({
            ...member,
            team_participation: member.team_participation ? JSON.parse(member.team_participation) : null,
            event_participation: member.event_participation ? JSON.parse(member.event_participation) : null
        }));

        res.status(200).json({ data: members });

    } catch (err) {
        console.error('Error fetching members:', err);
        res.status(500).json({
            message: 'Error fetching members',
            error: err.message
        });
    }
};

// Get a single member by ID with full details
export const getMemberById = async (req, res) => {
    try {
        const { member_id } = req.params;

        const sql = `
            SELECT 
                m.*,
                u.first_name,
                u.last_name,
                u.email,
                u.phone,
                u.address,
                u.date_of_birth,
                f.family_name
            FROM MEMBER m
            JOIN USER u ON m.user_id = u.user_id
            LEFT JOIN FAMILY f ON m.family_id = f.family_id
            WHERE m.member_id = ?
        `;

        const results = await db.query(sql, [member_id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Parse JSON fields
        const member = {
            ...results[0],
            team_participation: results[0].team_participation ? JSON.parse(results[0].team_participation) : null,
            event_participation: results[0].event_participation ? JSON.parse(results[0].event_participation) : null
        };

        res.status(200).json({ data: member });

    } catch (err) {
        console.error('Error fetching member:', err);
        res.status(500).json({
            message: 'Error fetching member',
            error: err.message
        });
    }
};

// Update a member
export const updateMember = async (req, res) => {
    try {
        const { member_id } = req.params;
        const {
            membership_status,
            baptism_date,
            family_id,
            family_relationship,
            team_participation,
            spiritual_gifts,
            event_participation,
            notes
        } = req.body;

        // Validate JSON fields if provided
        if (team_participation) {
            try {
                JSON.parse(JSON.stringify(team_participation));
            } catch (err) {
                return res.status(400).json({ message: 'Invalid team_participation format' });
            }
        }

        if (event_participation) {
            try {
                JSON.parse(JSON.stringify(event_participation));
            } catch (err) {
                return res.status(400).json({ message: 'Invalid event_participation format' });
            }
        }

        const sql = `
            UPDATE MEMBER SET
                membership_status = ?,
                baptism_date = ?,
                family_id = ?,
                family_relationship = ?,
                team_participation = ?,
                spiritual_gifts = ?,
                event_participation = ?,
                notes = ?
            WHERE member_id = ?
        `;

        const params = [
            membership_status,
            baptism_date || null,
            family_id || null,
            family_relationship || null,
            team_participation ? JSON.stringify(team_participation) : null,
            spiritual_gifts || null,
            event_participation ? JSON.stringify(event_participation) : null,
            notes || null,
            member_id
        ];

        const results = await db.query(sql, params);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Member not found' });
        }

        res.status(200).json({ message: 'Member updated successfully' });

    } catch (err) {
        console.error('Error updating member:', err);
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ message: 'Invalid family_id' });
        }
        res.status(500).json({
            message: 'Error updating member',
            error: err.message
        });
    }
};

// Delete a member (soft delete recommended)
export const deleteMember = async (req, res) => {
    try {
        const { member_id } = req.params;

        // Recommended soft delete approach:
        const sql = 'UPDATE MEMBER SET membership_status = "inactive" WHERE member_id = ?';

        // If you must hard delete:
        // const sql = 'DELETE FROM MEMBER WHERE member_id = ?';

        const results = await db.query(sql, [member_id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Member not found' });
        }

        res.status(200).json({ message: 'Member deactivated successfully' });

    } catch (err) {
        console.error('Error deleting member:', err);
        res.status(500).json({
            message: 'Error deleting member',
            error: err.message
        });
    }
};

// Add team participation for a member
export const addTeamParticipation = async (req, res) => {
    try {
        const { member_id } = req.params;
        const { team_id, role = 'member' } = req.body;

        // Validate role
        const validRoles = ['member', 'leader', 'coordinator'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        // Get current team participation
        const current = await db.query(
            'SELECT team_participation FROM MEMBER WHERE member_id = ?',
            [member_id]
        );

        if (current.length === 0) {
            return res.status(404).json({ message: 'Member not found' });
        }

        let teams = current[0].team_participation ? JSON.parse(current[0].team_participation) : [];

        // Check if already in team
        if (teams.some(t => t.team_id === team_id && t.is_active)) {
            return res.status(409).json({ message: 'Member already active in this team' });
        }

        // Add new team participation
        teams.push({
            team_id,
            role,
            join_date: new Date().toISOString().split('T')[0],
            end_date: null,
            is_active: true
        });

        // Update member record
        await db.query(
            'UPDATE MEMBER SET team_participation = ? WHERE member_id = ?',
            [JSON.stringify(teams), member_id]
        );

        res.status(200).json({ message: 'Team participation added successfully' });

    } catch (err) {
        console.error('Error adding team participation:', err);
        res.status(500).json({
            message: 'Error adding team participation',
            error: err.message
        });
    }
};

export default {
    createMember,
    getMembers,
    getMemberById,
    updateMember,
    deleteMember,
    addTeamParticipation
};