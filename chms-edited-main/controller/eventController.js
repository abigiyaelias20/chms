import initializeDatabase from '../config/db.js';

let db;

// Initialize DB at server start
(async () => {
  db = await initializeDatabase();
})();

// Create Event
export const createEvent = async (req, res) => {
  try {
    const { ministry_id, team_id, title, description, start_date, end_date, location, recurrence_pattern, status } = req.body;

    if (!ministry_id || !title || !start_date) {
      return res.status(400).json({ message: "Ministry ID, title, and start date are required" });
    }

    const sql = `
      INSERT INTO EVENT (ministry_id, team_id, title, description, start_date, end_date, location, recurrence_pattern, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      ministry_id,
      team_id || null,
      title,
      description || null,
      start_date,
      end_date || null,
      location || null,
      recurrence_pattern || null,
      status || 'Planned'
    ];

    const result = await db.query(sql, params);

    res.status(201).json({
      message: "Event created",
      eventId: result.insertId
    });

  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({
      message: "Failed to create event",
      error: err.message
    });
  }
};

// Get All Events
export const getAllEvents = async (req, res) => {
  try {
    const user_id = req.user.id; // From verifyStaffOrAdmin middleware
    const user_type = req.user.role;

    let query = `
      SELECT e.*, m.name AS ministry_name, t.name AS team_name
      FROM EVENT e
      LEFT JOIN MINISTRY m ON e.ministry_id = m.ministry_id
      LEFT JOIN MINISTRY_TEAM t ON e.team_id = t.team_id
    `;
    let params = [];

    // If user is staff, filter events from ministries where they are assigned
    // if (user_type === 'Staff') {
    //   query += `
    //     WHERE e.ministry_id IN (
    //       SELECT ministry_id
    //       FROM STAFF
    //       WHERE user_id = ?
    //     )
    //   `;
    //   params = [user_id];
    // }

    const [results] = await db.query(query, params);
    console.log("Neww Event", results)
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({
      message: "Failed to fetch events",
      error: err.message
    });
  }
};


export const getAllActiveEvents = async (req, res) => {
  try {
    const query = `
      SELECT e.*, m.name AS ministry_name, t.name AS team_name
      FROM EVENT e
      LEFT JOIN MINISTRY m ON e.ministry_id = m.ministry_id
      LEFT JOIN MINISTRY_TEAM t ON e.team_id = t.team_id
      WHERE e.status = 'Active'
    `;

    const [results] = await db.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching active events:", err);
    res.status(500).json({
      message: "Failed to fetch active events",
      error: err.message
    });
  }
};

// Get Event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db.query(`
      SELECT e.*, m.name AS ministry_name, t.name AS team_name
      FROM EVENT e
      LEFT JOIN MINISTRY m ON e.ministry_id = m.ministry_id
      LEFT JOIN MINISTRY_TEAM t ON e.team_id = t.team_id
      WHERE e.event_id = ?
    `, [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(results[0]);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({
      message: "Failed to fetch event",
      error: err.message
    });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { ministry_id, team_id, title, description, start_date, end_date, location, recurrence_pattern, status } = req.body;

    if (!ministry_id || !title || !start_date) {
      return res.status(400).json({ message: "Ministry ID, title, and start date are required" });
    }

    const sql = `
      UPDATE EVENT
      SET ministry_id = ?, team_id = ?, title = ?, description = ?, start_date = ?, end_date = ?, location = ?, recurrence_pattern = ?, status = ?
      WHERE event_id = ?
    `;
    const params = [
      ministry_id,
      team_id || null,
      title,
      description || null,
      start_date,
      end_date || null,
      location || null,
      recurrence_pattern || null,
      status || 'Planned',
      id
    ];

    const result = await db.query(sql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event updated" });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({
      message: "Failed to update event",
      error: err.message
    });
  }
};

// Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM EVENT WHERE event_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({
      message: "Failed to delete event",
      error: err.message
    });
  }
};

export default {
  createEvent,
  getAllEvents,
  getAllActiveEvents,
  getEventById,
  updateEvent,
  deleteEvent
};