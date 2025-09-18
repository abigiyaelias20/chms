import db from '../config/db.js';

export const createGroup = (req, res) => {
    const { group_name, leader_id, meeting_time } = req.body;
    const sql = `INSERT INTO BIBLE_STUDY_GROUP (group_name, leader_id, meeting_time) VALUES (?, ?, ?)`;
    db.query(sql, [group_name, leader_id, meeting_time], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: 'Bible study group created', data: result });
    });
};

export const getGroups = (req, res) => {
    db.query('SELECT * FROM BIBLE_STUDY_GROUP', (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ data: result });
    });
};

export const getGroupById = (req, res) => {
    db.query('SELECT * FROM BIBLE_STUDY_GROUP WHERE group_id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ data: result[0] });
    });
};

export const updateGroup = (req, res) => {
    const { group_name, leader_id, meeting_time } = req.body;
    const sql = `UPDATE BIBLE_STUDY_GROUP SET group_name = ?, leader_id = ?, meeting_time = ? WHERE group_id = ?`;
    db.query(sql, [group_name, leader_id, meeting_time, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ message: 'Group updated' });
    });
};

export const deleteGroup = (req, res) => {
    db.query('DELETE FROM BIBLE_STUDY_GROUP WHERE group_id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ message: 'Group deleted' });
    });
};
