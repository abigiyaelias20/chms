import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_SECRET_KEY, JWT_EXPIRES_IN, JWT_REFRESH_SECRET_KEY } from '../config/env.js';
import initializeDatabase from '../config/db.js';

let db;

// Initialize DB at server start
(async () => {
    db = await initializeDatabase();
})();


export const loginUser = async (email, password) => {

  
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  try {
    const [users] = await db.query(
      'SELECT * FROM USER WHERE LOWER(email) = LOWER(?)', 
      [email.trim().toLowerCase()]
    );



    if (users.length === 0) {
      // Use a dummy comparison for security (timing attack protection)
      await bcrypt.compare(password, '$2a$10$fakehashforsecurity');
      throw new Error('Invalid credentials');
    }

    const user = users[0];

    // Check if password_hash exists and is a string
    if (!user.password_hash || typeof user.password_hash !== 'string') {
      throw new Error('Account configuration error. Please contact administrator.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) throw new Error('Invalid credentials');

    // if (user.status !== 'Active') throw new Error('Account is not active');

    // Make sure JWT secrets are defined
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error('JWT secret key not configured');
    }

    const accessToken = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.user_type
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '3d',
        algorithm: 'HS256'
      }
    );

    const refreshToken = jwt.sign(
      { id: user.user_id },
      process.env.JWT_REFRESH_SECRET_KEY || process.env.JWT_SECRET_KEY,
      { expiresIn: '7d' }
    );

    await db.query(
      'INSERT INTO RefreshToken (user_id, token) VALUES (?, ?)',
      [user.user_id, refreshToken]
    );

    await db.query(
      'UPDATE USER SET last_login = NOW() WHERE user_id = ?',
      [user.user_id]
    );

    const { password_hash, ...userData } = user;

    return {
      user: userData,
      token: accessToken,
      refreshToken, 
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    };

  } catch (error) {
    
    throw error;
  }
};

export const refreshToken = async (req, res) => {
  const refreshTokenFromCookie = req.cookies?.refreshToken;

  const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;

  if (!refreshTokenFromCookie) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const decoded = jwt.verify(refreshTokenFromCookie, JWT_REFRESH_SECRET_KEY);
    const userId = decoded.id;

    const [tokens] = await db.query(
      'SELECT * FROM RefreshToken WHERE user_id = ? AND token = ?',
      [userId, refreshTokenFromCookie]
    );

    if (tokens.length === 0) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    await db.query(
      'DELETE FROM RefreshToken WHERE user_id = ? AND token = ?',
      [userId, refreshTokenFromCookie]
    );

    const newAccessToken = jwt.sign(
      { user_id: userId },
      JWT_SECRET_KEY,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const newRefreshToken = jwt.sign(
      { id: userId },
      JWT_REFRESH_SECRET_KEY,
      { expiresIn: '7d' }
    );

    await db.query(
      'INSERT INTO RefreshToken (user_id, token) VALUES (?, ?)',
      [userId, newRefreshToken]
    );

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ token: newAccessToken, refreshToken: newRefreshToken });

  } catch (error) {
    console.error('Refresh error:', error.message);
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};
