const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getSessions,
  getSessionMessages
} = require('../controllers/chatController');
const { authenticateToken, authorize, optionalAuth } = require('../middleware/auth');

router.post('/message', optionalAuth, sendMessage);
router.get('/sessions', authenticateToken, authorize('admin'), getSessions);
router.get('/sessions/:id', authenticateToken, authorize('admin'), getSessionMessages);

module.exports = router;
