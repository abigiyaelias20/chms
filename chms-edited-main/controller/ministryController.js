import initializeDatabase from '../config/db.js';

let db;

// Initialize DB at server start
(async () => {
  db = await initializeDatabase();
})();

// Create Ministry
export const createMinistry = async (req, res) => {
  try {
    const { name, type, description } = req.body;


    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" });
    }

    const sql = `
      INSERT INTO MINISTRY (name, type, description)
      VALUES (?, ?, ?)
    `;
    const params = [name, type, description || null];

    const result = await db.query(sql, params);

    res.status(201).json({
      message: "Ministry created",
      ministryId: result.insertId
    });

  } catch (err) {
    console.error("Error creating ministry:", err);
    res.status(500).json({
      message: "Failed to create ministry",
      error: err.message
    });
  }
};

// Get All Ministries
export const getAllMinistries = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM MINISTRY");
    console.log(results);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching ministries:", err);
    res.status(500).json({
      message: "Failed to fetch ministries",
      error: err.message
    });
  }
};

// Get Ministry by ID
export const getMinistryById = async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db.query("SELECT * FROM MINISTRY WHERE id = ?", [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Ministry not found" });
    }

    res.status(200).json(results[0]);
  } catch (err) {
    console.error("Error fetching ministry:", err);
    res.status(500).json({
      message: "Failed to fetch ministry",
      error: err.message
    });
  }
};

// Update Ministry
export const updateMinistry = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, description } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" });
    }

    const sql = 'UPDATE MINISTRY SET name = ?, type = ?, description = ? WHERE ministry_id = ?';
    const result = await db.query(sql, [name, type, description || null, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ministry not found" });
    }

    res.status(200).json({ message: "Ministry updated" });
  } catch (err) {
    console.error("Error updating ministry:", err);
    res.status(500).json({
      message: "Failed to update ministry",
      error: err.message
    });
  }
};

// Delete Ministry
export const deleteMinistry = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM MINISTRY WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ministry not found" });
    }

    res.status(200).json({ message: "Ministry deleted" });
  } catch (err) {
    console.error("Error deleting ministry:", err);
    res.status(500).json({
      message: "Failed to delete ministry",
      error: err.message
    });
  }
};

export default {
  createMinistry,
  getAllMinistries,
  getMinistryById,
  updateMinistry,
  deleteMinistry
};
