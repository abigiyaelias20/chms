import { loginUser } from '../services/authService.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { user, token , refreshToken} = await loginUser(email, password);

    res.status(200).json({
      message: 'Login successful',
      token,
      refreshToken,
      user
    });

  } catch (error) {
    res.status(401).json({ error: error.message || 'Login failed' });
  }
};