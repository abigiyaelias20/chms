import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import initializeDatabase from "./config/db.js";
import createUserSchema from "./models/user.js";
import createMinistrySchema from "./models/ministry.js";
import createExpenseSchema from "./models/expense.js";
import createEventSchema from "./models/event.js";
import createMemberSchema from "./models/member.js";
import createVolunteerSlotSchema from "./models/volunteer_slot.js";
import createVolunteerAssignmentSchema from "./models/volenteer_assignment.js";
import createMinistryTeamSchema from './models/ministry_team.js'
import createDonationSchema from "./models/donation.js";
import createDonationCampaignSchema from "./models/donation_campaign.js";

import createTeamRoleSchema from "./models/team_role.js";
import createSpiritualRecordSchema from "./models/spritual_Record.js";
import createEventOccurrenceSchema from "./models/event_occurrence.js";
import createCounselingSessionSchema from "./models/counseling_Session.js";
// import createMemberSchema from './models/member.js';
import createPastoralCareSchema from "./models/pastoral_care.js";
import createAttendanceSchema from "./models/attendance.js";
import createBudgetSchema from "./models/budget.js";
import createFamilySchema from "./models/family.js";
import createStaffSchema from "./models/staff.js";
import routes from './routes/index.js'
import createRefreshTokenSchema from "./models/refreshToken.js";

const schemaCreationFunctions = [
  // Core tables without dependencies
  { fn: createUserSchema, name: 'User' },
  { fn: createRefreshTokenSchema, name: 'User' },
  { fn: createMinistrySchema, name: 'Ministry' },
  { fn: createMinistryTeamSchema, name: 'MinistryTeam' },
  { fn: createFamilySchema, name: 'Family' },
  { fn: createBudgetSchema, name: 'Budget' },
  
  // Tables that depend on core tables
  { fn: createStaffSchema, name: 'Staff' },
  { fn: createEventSchema, name: 'Event' },
  { fn: createDonationCampaignSchema, name: 'DonationCampaign' },
  
  
  // Tables with secondary dependencies
  { fn: createEventOccurrenceSchema, name: 'EventOccurrence' },
  { fn: createVolunteerSlotSchema, name: 'VolunteerSlot' },
  { fn: createMemberSchema, name: 'Member' },
  { fn: createVolunteerAssignmentSchema, name: 'VolunteerAssignment' },
  { fn: createTeamRoleSchema, name: 'TeamRole' },
  { fn: createSpiritualRecordSchema, name: 'SpiritualRecord' },
  { fn: createPastoralCareSchema, name: 'PastoralCare' },
  { fn: createExpenseSchema, name: 'Expense' },
  { fn: createDonationSchema, name: 'Donation' },
  { fn: createCounselingSessionSchema, name: 'CounselingSession' },
  { fn: createAttendanceSchema, name: 'Attendance' }
];

dotenv.config(); // Load environment variables from .env

const app = express();

// Middleware
app.use(cors());
app.use(cookieParser()); // To parse cookies
app.use(express.json()); // To parse incoming JSON requests

initializeDatabase()
  .then(async (db) => {

    app.locals.db = db;

    // ✅ Await your async schema creation
    for (const { fn, name } of schemaCreationFunctions) {
      try {
        await fn(db);
        console.log(`✅ ${name} schema initialized successfully`);
      } catch (error) {
        console.error(`❌ Failed to initialize ${name} schema:`, error.message);
        // Continue with next schema even if one fails
      }
    }

    console.log('🎉 Database schema initialization completed');


    // Example route
    app.get("/", (req, res) => {
      res.send("Server is up and database connected!");
    });

    app.use('/api', routes)

    app.listen(5000, () => {
      console.log("✅ Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.log(err)
    console.error("❌ Database setup failed:", err.message || err);
    process.exit(1);
  });
  
 