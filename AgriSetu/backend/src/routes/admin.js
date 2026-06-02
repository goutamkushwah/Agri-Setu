const express = require('express');
const router = express.Router();
const { getStats, getUsers } = require('../controllers/adminController');
const { getAllOrders } = require('../controllers/orderController');
const { getSessions } = require('../controllers/chatController');
const { authenticateToken, authorize } = require('../middleware/auth');

router.use(authenticateToken, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/orders', getAllOrders);
router.get('/chats', getSessions);

module.exports = router;
