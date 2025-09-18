import db from '../config/db.js';

export const createExpense = (req, res) => {
    const { budget_id, description, amount, vendor, approval_status } = req.body;
    const sql = 'INSERT INTO EXPENSE (budget_id, description, amount, vendor, approval_status) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [budget_id, description, amount, vendor, approval_status], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Expense created', expenseId: result.insertId });
    });
};

export const getExpenses = (req, res) => {
    db.query('SELECT * FROM EXPENSE', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
};
