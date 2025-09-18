import express from 'express';
import { login } from '../controller/authController.js';
import {loginUser ,refreshToken } from '../services/authService.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', login);
router.post('/refresh', refreshToken)




export default router;