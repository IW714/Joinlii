const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
      // Input Validation
      if (!email || !password) {
          console.log('Email and password are required.');
          return res.status(400).json({ success: false, message: 'Email and password are required.' });
      }

      // Find the user by email
      const user = await prisma.user.findUnique({
          where: { email },
      });

      if (!user) {
          console.log('User not found with email:', email);
          return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
          console.log('Password mismatch for user:', email);
          return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      // Generate JWT
      const accessToken = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: '7d' }
      );

      // Optionally, set refresh token as HTTP-only cookie
      res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Send access token to frontend
      res.json({ accessToken, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const handleLogout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use 'true' in production
    sameSite: 'Strict',
  });
  res.json({ message: 'Logged out successfully' });
};

module.exports = { handleLogin, handleLogout };