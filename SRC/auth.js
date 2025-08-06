const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');
const { loginValidation, handleValidationErrors } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Login
router.post('/login', loginValidation, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;

    db.get(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
           const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    message: 'Token is valid',
    user: req.user
  });
});

// Create admin user (for initial setup)
router.post('/create-admin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin already exists
    db.get('SELECT * FROM users WHERE role = "admin"', async (err, existingAdmin) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (existingAdmin) {
        return res.status(400).json({ error: 'Admin user already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.run(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        [email, hashedPassword, 'admin'],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create admin user' });
          }

          res.status(201).json({
            message: 'Admin user created successfully',
            userId: this.lastID
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
