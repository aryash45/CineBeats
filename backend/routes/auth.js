const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbHelper } = require('../config/database');
const authMiddleware = require('../middleware/auth');

// POST /auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Password strength: min 8, 1 uppercase, 1 number
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long, contain at least 1 uppercase letter and 1 number' });
    }

    // Check if email exists
    const existingUser = await dbHelper.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const result = await dbHelper.run(
      'INSERT INTO users (email, password_hash, username) VALUES (?, ?, ?)',
      [email, passwordHash, username]
    );

    // Generate token
    const token = jwt.sign({ userId: result.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: result.id, email, username, theme: 'light' }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error during signup' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await dbHelper.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      user: { id: user.id, email: user.email, username: user.username, theme: user.theme }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// GET /auth/profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await dbHelper.get('SELECT id, email, username, theme, created_at FROM users WHERE id = ?', [req.userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /auth/profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { username, theme } = req.body;

    if (!username || !theme) {
      return res.status(400).json({ error: 'Username and theme are required' });
    }

    await dbHelper.run(
      'UPDATE users SET username = ?, theme = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [username, theme, req.userId]
    );

    const updatedUser = await dbHelper.get('SELECT id, email, username, theme FROM users WHERE id = ?', [req.userId]);
    res.json(updatedUser);

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error during profile update' });
  }
});

module.exports = router;
