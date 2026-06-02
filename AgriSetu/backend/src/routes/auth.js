const express = require('express');
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getProfile
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');

// Public routes
router.post('/register', validateRequest(schemas.register), register);
router.post('/login', validateRequest(schemas.login), login);
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticateToken, logout);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', validateRequest(schemas.forgotPassword), forgotPassword);
router.post('/reset-password', validateRequest(schemas.resetPassword), resetPassword);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

module.exports = router;
