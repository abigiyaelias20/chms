import bcrypt from 'bcryptjs';
import initializeDatabase from '../config/db.js';

let db;

// Initialize DB at server start
(async () => {
    db = await initializeDatabase();
})();

export const createUser = async (req, res) => {
    const {
        email,
        password,
        first_name,
        last_name,
        date_of_birth,
        phone,
        address,
        user_type,
        status = 'Active'
    } = req.body;

    if (!email || !password || !first_name || !last_name || !user_type) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    console.log('Creating user with data:', req.body);

    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const sql = `
      INSERT INTO USER (
        email,
        password_hash,
        first_name,
        last_name,
        date_of_birth,
        phone,
        address,
        user_type,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const params = [
            email,
            password_hash,
            first_name,
            last_name,
            date_of_birth || null,
            phone || null,
            address || null,
            user_type,
            status
        ];

        const result = await db.query(sql, params);
        res.status(201).json({
            message: 'User created successfully',
            userId: result.insertId
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already exists' });
        }
        console.error('Error creating user:', err);
        res.status(500).json({
            message: 'Error creating user',
            error: err.message
        });
    }
};

export const getUsers = async (req, res) => {
    try {
        const { user_type, status } = req.query;
        let sql = 'SELECT user_id, email, first_name, last_name, user_type, status FROM USER';
        const params = [];

        const conditions = [];
        if (user_type) {
            conditions.push('user_type = ?');
            params.push(user_type);
        }
        if (status) {
            conditions.push('status = ?');
            params.push(status);
        }

        if (conditions.length) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

    const [rows] = await db.query(sql, params)
        res.status(200).json({ data: rows });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({
            message: 'Error fetching users',
            error: err.message
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { user_id } = req.params;

        const sql = `
      SELECT 
        user_id,
        email,
        first_name,
        last_name,
        date_of_birth,
        phone,
        address,
        user_type,
        status,
        last_login
      FROM USER
      WHERE user_id = ?
    `;

        const results = await db.query(sql, [user_id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ data: results[0] });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({
            message: 'Error fetching user',
            error: err.message
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        const {
            email,
            first_name,
            last_name,
            date_of_birth,
            phone,
            address,
            user_type,
            status
        } = req.body;

        const sql = `
      UPDATE USER SET 
        email = ?,
        first_name = ?,
        last_name = ?,
        date_of_birth = ?,
        phone = ?,
        address = ?,
        user_type = ?,
        status = ?
      WHERE user_id = ?
    `;

        const params = [
            email,
            first_name,
            last_name,
            date_of_birth || null,
            phone || null,
            address || null,
            user_type,
            status,
            user_id
        ];

        const result = await db.query(sql, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already exists' });
        }
        console.error('Error updating user:', err);
        res.status(500).json({
            message: 'Error updating user',
            error: err.message
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        const sql = 'DELETE FROM USER WHERE user_id = ?';
        const result = await db.query(sql, [user_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({
            message: 'Error deleting user',
            error: err.message
        });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { new_password_hash } = req.body;

        if (!new_password_hash) {
            return res.status(400).json({ message: 'New password is required' });
        }

        const sql = 'UPDATE USER SET password_hash = ? WHERE user_id = ?';
        const result = await db.query(sql, [new_password_hash, user_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error updating password:', err);
        res.status(500).json({
            message: 'Error updating password',
            error: err.message
        });
    }
};

export default {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    updatePassword
};
