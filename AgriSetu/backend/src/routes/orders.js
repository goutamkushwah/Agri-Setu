const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');

router.post('/', authenticateToken, validateRequest(schemas.createOrder), createOrder);
router.get('/my', authenticateToken, authorize('customer'), getMyOrders);
router.get('/farmer', authenticateToken, authorize('farmer'), getFarmerOrders);
router.get('/', authenticateToken, authorize('admin'), getAllOrders);
router.patch('/:id/status', authenticateToken, authorize('admin', 'farmer'), updateOrderStatus);

module.exports = router;
