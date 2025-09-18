import initializeDatabase from '../config/db.js';

let db;

// Initialize DB at server start
(async () => {
  db = await initializeDatabase();
})();

// Create Team Role
export const createTeamRole = async (req, res) => {
  try {
    const { team_id, title, responsibilities } = req.body;
    const user_id = req.user.user_id;
    const user_type = req.user.role;

        console.log("user id", user_id)


    if (!team_id || !title) {
      return res.status(400).json({ message: "Team ID and title are required" });
    }

    // ✅ Verify team exists (avoid FK constraint violation)
    const [teamCheck] = await db.query(
      `SELECT team_id, ministry_id FROM MINISTRY_TEAM WHERE team_id = ?`,
      [team_id]
    );
    if (teamCheck.length === 0) {
      return res.status(404).json({ message: "Team not found" });
    }

    console.log("tema check", teamCheck)

    // ✅ For staff, ensure they are assigned to the team's ministry
    if (user_type === "Staff") {
      const [ministryCheck] = await db.query(
        `
        SELECT 1
        FROM STAFF s
        WHERE s.user_id = ? AND s.ministry_id = ?
        `,
        [user_id, teamCheck[0].ministry_id]
      );

      if (ministryCheck.length === 0) {
        return res.status(403).json({
          message: "Unauthorized: Staff not assigned to this team's ministry",
        });
      }
    }


    const sql = `
      INSERT INTO TEAM_ROLE (team_id, title, responsibilities)
      VALUES (?, ?, ?)
    `;
    const params = [team_id, title, responsibilities || null];

    const [result] = await db.query(sql, params);

    res.status(201).json({
      message: "Team role created",
      roleId: result.insertId,
    });
  } catch (err) {
    console.error("Error creating team role:", err);
    res.status(500).json({
      message: "Failed to create team role",
      error: err.message,
    });
  }
};


// Assign Team Role to Member (e.g., leader)
export const assignTeamRole = async (req, res) => {
  try {
    const { role_id, member_id } = req.body;
    const user_id = req.user.user_id;
    const user_type = req.user.role;

    if (!role_id || !member_id) {
      return res.status(400).json({ message: "Role ID and member ID are required" });
    }

    // Check if role and member exist
    const [role] = await db.query(`SELECT team_id, title FROM TEAM_ROLE WHERE role_id = ?`, [role_id]);
    if (role.length === 0) {
      return res.status(404).json({ message: "Team role not found" });
    }

    const [member] = await db.query(`SELECT user_id FROM MEMBER WHERE member_id = ?`, [member_id]);
    if (member.length === 0) {
      return res.status(404).json({ message: "Member not found" });
    }

    // For staff, ensure they are assigned to the team's ministry
    if (user_type === 'Staff') {
      const [ministryCheck] = await db.query(`
        SELECT 1
        FROM MINISTRY_TEAM mt
        JOIN STAFF s ON mt.ministry_id = s.ministry_id
        WHERE mt.team_id = ? AND s.user_id = ?
      `, [role[0].team_id, user_id]);

      if (ministryCheck.length === 0) {
        return res.status(403).json({ message: "Unauthorized: Staff not assigned to this team's ministry" });
      }
    }

    // Update member's team_participation JSON
    const newParticipation = {
      team_id: role[0].team_id,
      role: role[0].title.toLowerCase() === 'leader' ? 'leader' : 'member',
      join_date: new Date().toISOString().split('T')[0],
      is_active: true
    };

    // Fetch current team_participation
    const [currentMember] = await db.query(`SELECT team_participation FROM MEMBER WHERE member_id = ?`, [member_id]);
    let teamParticipation = currentMember[0].team_participation ? JSON.parse(currentMember[0].team_participation) : [];

    // Check if member is already in the team
    const existingIndex = teamParticipation.findIndex(p => p.team_id === role[0].team_id && p.is_active);
    if (existingIndex !== -1) {
      // Update existing participation
      teamParticipation[existingIndex] = newParticipation;
    } else {
      // Add new participation
      teamParticipation.push(newParticipation);
    }

    // Update MEMBER table
    await db.query(`
      UPDATE MEMBER
      SET team_participation = ?
      WHERE member_id = ?
    `, [JSON.stringify(teamParticipation), member_id]);

    res.status(200).json({
      message: "Team role assigned and member participation updated"
    });
  } catch (err) {
    console.error("Error assigning team role:", err);
    res.status(500).json({
      message: "Failed to assign team role",
      error: err.message
    });
  }
};

// Get All Team Roles
export const getAllTeamRoles = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const user_type = req.user.role;
    const { team_id } = req.query; // Optional filter by team_id

    let query = `
      SELECT tr.*, t.name AS team_name, m.name AS ministry_name
      FROM TEAM_ROLE tr
      JOIN MINISTRY_TEAM t ON tr.team_id = t.team_id
      JOIN MINISTRY m ON t.ministry_id = m.ministry_id
    `;
    let params = [];

    if (team_id) {
      query += ` WHERE tr.team_id = ?`;
      params.push(team_id);
    }

    // For staff, filter roles from ministries where they are assigned
    if (user_type === 'Staff') {
      query += params.length ? ' AND' : ' WHERE';
      query += `
        t.ministry_id IN (
          SELECT ministry_id
          FROM STAFF
          WHERE user_id = ?
        )
      `;
      params.push(user_id);
    }

    const [results] = await db.query(query, params);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching team roles:", err);
    res.status(500).json({
      message: "Failed to fetch team roles",
      error: err.message
    });
  }
};

// Get Team Role by ID
export const getTeamRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const user_type = req.user.role;

    let query = `
      SELECT tr.*, t.name AS team_name, m.name AS ministry_name
      FROM TEAM_ROLE tr
      JOIN MINISTRY_TEAM t ON tr.team_id = t.team_id
      JOIN MINISTRY m ON t.ministry_id = m.ministry_id
      WHERE tr.role_id = ?
    `;
    let params = [id];

    // For staff, ensure they are assigned to the team's ministry
    if (user_type === 'Staff') {
      query += `
        AND t.ministry_id IN (
          SELECT ministry_id
          FROM STAFF
          WHERE user_id = ?
        )
      `;
      params.push(user_id);
    }

    const [results] = await db.query(query, params);

    if (results.length === 0) {
      return res.status(404).json({ message: "Team role not found" });
    }

    res.status(200).json(results[0]);
  } catch (err) {
    console.error("Error fetching team role:", err);
    res.status(500).json({
      message: "Failed to fetch team role",
      error: err.message
    });
  }
};

// Update Team Role
export const updateTeamRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { team_id, title, responsibilities } = req.body;
    const user_id = req.user.id;
    const user_type = req.user.role;

    if (!team_id || !title) {
      return res.status(400).json({ message: "Team ID and title are required" });
    }

    // For staff, ensure they are assigned to the team's ministry
    if (user_type === 'Staff') {
      const [ministryCheck] = await db.query(`
        SELECT 1
        FROM MINISTRY_TEAM mt
        JOIN STAFF s ON mt.ministry_id = s.ministry_id
        WHERE mt.team_id = ? AND s.user_id = ?
      `, [team_id, user_id]);

      if (ministryCheck.length === 0) {
        return res.status(403).json({ message: "Unauthorized: Staff not assigned to this team's ministry" });
      }
    }

    const sql = `
      UPDATE TEAM_ROLE
      SET team_id = ?, title = ?, responsibilities = ?
      WHERE role_id = ?
    `;
    const params = [team_id, title, responsibilities || null, id];

    const result = await db.query(sql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Team role not found" });
    }

    res.status(200).json({ message: "Team role updated" });
  } catch (err) {
    console.error("Error updating team role:", err);
    res.status(500).json({
      message: "Failed to update team role",
      error: err.message
    });
  }
};

// Delete Team Role
export const deleteTeamRole = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const user_type = req.user.role;

    // Check if role exists and get team_id
    const [role] = await db.query(`SELECT team_id FROM TEAM_ROLE WHERE role_id = ?`, [id]);
    if (role.length === 0) {
      return res.status(404).json({ message: "Team role not found" });
    }

    // For staff, ensure they are assigned to the team's ministry
    if (user_type === 'Staff') {
      const [ministryCheck] = await db.query(`
        SELECT 1
        FROM MINISTRY_TEAM mt
        JOIN STAFF s ON mt.ministry_id = s.ministry_id
        WHERE mt.team_id = ? AND s.user_id = ?
      `, [role[0].team_id, user_id]);

      if (ministryCheck.length === 0) {
        return res.status(403).json({ message: "Unauthorized: Staff not assigned to this team's ministry" });
      }
    }

    // Remove role from team_participation in MEMBER table
    const [members] = await db.query(`SELECT member_id, team_participation FROM MEMBER WHERE team_participation IS NOT NULL`);
    for (const member of members) {
      let teamParticipation = member.team_participation ? JSON.parse(member.team_participation) : [];
      teamParticipation = teamParticipation.filter(p => p.team_id !== role[0].team_id || !p.is_active);
      await db.query(`
        UPDATE MEMBER
        SET team_participation = ?
        WHERE member_id = ?
      `, [teamParticipation.length ? JSON.stringify(teamParticipation) : null, member.member_id]);
    }

    // Delete the role
    const [result] = await db.query('DELETE FROM TEAM_ROLE WHERE role_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Team role not found" });
    }

    res.status(200).json({ message: "Team role deleted and member participations updated" });
  } catch (err) {
    console.error("Error deleting team role:", err);
    res.status(500).json({
      message: "Failed to delete team role",
      error: err.message
    });
  }
};

export default {
  createTeamRole,
  assignTeamRole,
  getAllTeamRoles,
  getTeamRoleById,
  updateTeamRole,
  deleteTeamRole
};