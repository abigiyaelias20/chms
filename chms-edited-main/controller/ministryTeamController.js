import initializeDatabase from '../config/db.js';

let db;

// Initialize DB at server start
(async () => {
  db = await initializeDatabase();
})();

// Create Team
export const createTeam = async (req, res) => {
  try {
    const user_id = req.user.user_id; // From verifyStaffOrAdmin middleware
    const user_type = req.user.role;

    console.log("Creating team with data:", req.body);

    const { ministry_id, name, description, meeting_schedule } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Ministry ID and name are required" });
    }

    let staff_id = null;
    let ministry = ministry_id || null;
    if (user_type === 'Staff') {
      const [staffRows] = await db.query(
        `SELECT staff_id, ministry_id FROM STAFF WHERE user_id = ? LIMIT 1`,
        [user_id]
      );

      if (!staffRows || staffRows.length === 0) {
        return res.status(403).json({ message: "Staff record not found" });
      }

      staff_id = staffRows[0].staff_id;
      ministry = staffRows[0].ministry_id;


    }

    const sql = `
      INSERT INTO MINISTRY_TEAM (ministry_id, name, description, meeting_schedule)
      VALUES (?, ?, ?, ?)
    `;
    const params = [ministry, name, description || null, meeting_schedule || null];

    const [result] = await db.query(sql, params);

    res.status(201).json({
      message: "Team created",
      teamId: result.insertId
    });

  } catch (err) {
    console.error("Error creating team:", err);
    res.status(500).json({
      message: "Failed to create team",
      error: err.message
    });
  }
};


export const getAllTeams = async (req, res) => {
  try {
    const user_id = req.user.user_id; // From verifyStaffOrAdmin middleware
    const user_type = req.user.role;

    let query = `
      SELECT t.*, m.name AS ministry_name 
      FROM MINISTRY_TEAM t 
      LEFT JOIN MINISTRY m ON t.ministry_id = m.ministry_id
    `;
    let params = [];

    // If user is staff, filter teams where they are a leader
    if (user_type === 'Staff') {
      query += `
    WHERE t.ministry_id IN (
      SELECT ministry_id
      FROM STAFF
      WHERE user_id = ?
    )
  `;
      params = [user_id];
    }




    const [results] = await db.query(query, params);
    console.log("Teams", results)
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching teams:", err);
    res.status(500).json({
      message: "Failed to fetch teams",
      error: err.message
    });
  }
};

// Get Team by ID
export const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db.query(`
      SELECT t.*, m.name AS ministry_name 
      FROM MINISTRY_TEAM t 
      LEFT JOIN MINISTRY m ON t.ministry_id = m.ministry_id 
      WHERE t.team_id = ?
    `, [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json(results[0]);
  } catch (err) {
    console.error("Error fetching team:", err);
    res.status(500).json({
      message: "Failed to fetch team",
      error: err.message
    });
  }
};

// Update Team
export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id; // From verifyStaffOrAdmin middleware
    const user_type = req.user.role;
    const { ministry_id, name, description, meeting_schedule, status } = req.body;

    if (!ministry_id || !name) {
      return res.status(400).json({ message: "Ministry ID and name are required" });
    }

    let staff_id = null;
    if (user_type === 'Staff') {
      const [staffRows] = await db.query(
        `SELECT staff_id FROM STAFF WHERE user_id = ? LIMIT 1`,
        [user_id]
      );

      if (!staffRows || staffRows.length === 0) {
        return res.status(403).json({ message: "Staff record not found" });
      }

      staff_id = staffRows.staff_id;

      const [ministryCheck] = await db.query(
        `SELECT 1 FROM STAFF WHERE staff_id = ? AND ministry_id = ?`,
        [staff_id, ministry_id]
      );


      if (!ministryCheck || ministryCheck.length === 0) {
        return res.status(403).json({ message: "Unauthorized: Staff not assigned to this ministry" });
      }
    }

    const sql = `
      UPDATE MINISTRY_TEAM 
      SET ministry_id = ?, name = ?, description = ?, meeting_schedule = ?, status = ? 
      WHERE team_id = ?
    `;
    const params = [
      ministry_id,
      name,
      description || null,
      meeting_schedule || null,
      status || 'Active',
      id
    ];

    const result = await db.query(sql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json({ message: "Team updated" });
  } catch (err) {
    console.error("Error updating team:", err);
    res.status(500).json({
      message: "Failed to update team",
      error: err.message
    });
  }
};

// Delete Team
export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id; // From verifyStaffOrAdmin middleware
    const user_type = req.user.role;

    const [result] = await db.query('DELETE FROM MINISTRY_TEAM WHERE team_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Team not found" });
    }

    let staff_id = null;
    if (user_type === 'Staff') {
      const [staffRows] = await db.query(
        `SELECT staff_id FROM STAFF WHERE user_id = ? LIMIT 1`,
        [user_id]
      );

      if (!staffRows || staffRows.length === 0) {
        return res.status(403).json({ message: "Staff record not found" });
      }

      staff_id = staffRows.staff_id;

      const [ministryCheck] = await db.query(
        `SELECT 1 FROM STAFF WHERE staff_id = ? AND ministry_id = ?`,
        [staff_id, ministry_id]
      );


      if (!ministryCheck || ministryCheck.length === 0) {
        return res.status(403).json({ message: "Unauthorized: Staff not assigned to this ministry" });
      }
    }

    res.status(200).json({ message: "Team deleted" });
  } catch (err) {
    console.error("Error deleting team:", err);
    res.status(500).json({
      message: "Failed to delete team",
      error: err.message
    });
  }
};

export default {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam
};