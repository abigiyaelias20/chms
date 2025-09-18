import db from "./db.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "You are not authenticated!" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Token is not valid!" });
    req.user = user;
    next();
  });
};

export const verifyMember = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "Member") {
      next();
    } else {
      return res.status(403).json({ error: "You are not authorized!" });
    }
  });
};

export const verifyStaff = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "Staff") {
      next();
    } else {
      return res.status(403).json({ error: "You are not authorized!" });
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "Admin") {
      console.log("Auth Success")
      next();
    } else {
      return res.status(403).json({ error: "You are not authorized!" });
    }
  });
};

export const verifyStaffOrAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "Staff" || req.user.role === "Admin") {
      next();
    } else {
      return res.status(403).json({ error: "You are not authorized!" });
    }
  });
};

export const verifyStaffOrMember = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "Member" || req.user.role === "Staff") {
      next();
    } else {
      return res.status(403).json({ error: "You are not authorized!" });
    }
  });
};

export const verifyAll = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "Staff" || req.user.role === "Admin" || req.user.role === "Member") {
      next();
    } else {
      return res.status(403).json({ error: "You are not authorized!" });
    }
  });
};
