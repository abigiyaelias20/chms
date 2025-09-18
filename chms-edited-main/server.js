import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import initializeDatabase from "./config/db.js";

import createUserSchema from "./models/user.js";
import createMinistrySchema from "./models/ministry.js";
import createEventSchema from "./models/event.js";
import createMemberSchema from "./models/member.js";
import createStaffSchema from "./models/staff.js";
import createRefreshTokenSchema from "./models/refreshToken.js";

import routes from "./routes/index.js";

const schemaCreationFunctions = [
  // Core tables without dependencies
  { fn: createUserSchema, name: "User" },
  { fn: createRefreshTokenSchema, name: "RefreshToken" },
  { fn: createMinistrySchema, name: "Ministry" },

  // Tables that depend on core tables
  { fn: createStaffSchema, name: "Staff" },
  { fn: createEventSchema, name: "Event" },

  // Tables with secondary dependencies
  { fn: createMemberSchema, name: "Member" },
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

    console.log("🎉 Database schema initialization completed");

    // Example route
    app.get("/", (req, res) => {
      res.send("Server is up and database connected!");
    });

    app.use("/api", routes);

    app.listen(5000, () => {
      console.log("✅ Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("❌ Database setup failed:", err.message || err);
    process.exit(1);
  });
