import db from '../config/db.js';

export const createBudget = (req, res) => {
    const { ministry_id, amount, purpose } = req.body;
    const sql = `INSERT INTO BUDGET (ministry_id, amount, purpose) VALUES (?, ?, ?)`;
    db.query(sql, [ministry_id, amount, purpose], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: 'Budget created', data: result });
    });
};

export const getBudgets = (req, res) => {
    db.query('SELECT * FROM BUDGET', (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ data: result });
    });
};

export const getBudgetById = (req, res) => {
    db.query('SELECT * FROM BUDGET WHERE budget_id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ data: result[0] });
    });
};

export const updateBudget = (req, res) => {
    const { ministry_id, amount, purpose } = req.body;
    const sql = `UPDATE BUDGET SET ministry_id = ?, amount = ?, purpose = ? WHERE budget_id = ?`;
    db.query(sql, [ministry_id, amount, purpose, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ message: 'Budget updated' });
    });
};

export const deleteBudget = (req, res) => {
    db.query('DELETE FROM BUDGET WHERE budget_id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ message: 'Budget deleted' });
    });
};
