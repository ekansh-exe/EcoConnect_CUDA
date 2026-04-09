const express = require('express');
const passport = require('passport');
const { register, login } = require('../controllers/authController');
const { generateToken } = require('../utils/jwt');
const User = require('../models/User');

const router = express.Router();

// Email/Password routes
router.post('/register', register);
router.post('/login', login);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, generate JWT and redirect or return JSON
    const token = generateToken(req.user);
    // You can redirect to frontend with token in URL or send JSON
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

// Logout (client side token discard)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;