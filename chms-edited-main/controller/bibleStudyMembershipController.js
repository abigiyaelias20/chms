import db from '../config/db.js';

export const addMemberToGroup = (req, res) => {
    const { group_id, member_id } = req.body;
    const sql = `INSERT INTO BIBLE_STUDY_MEMBERS (group_id, member_id) VALUES (?, ?)`;
    db.query(sql, [group_id, member_id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: 'Member added to Bible study group', data: result });
    });
};

export const getGroupMembers = (req, res) => {
    const group_id = req.params.group_id;
    db.query('SELECT * FROM BIBLE_STUDY_MEMBERS WHERE group_id = ?', [group_id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ data: result });
    });
};

export const removeMemberFromGroup = (req, res) => {
    const { group_id, member_id } = req.body;
    db.query('DELETE FROM BIBLE_STUDY_MEMBERS WHERE group_id = ? AND member_id = ?', [group_id, member_id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ message: 'Member removed from group' });
    });
};
