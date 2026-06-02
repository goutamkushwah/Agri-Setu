const express = require('express');
const router = express.Router();
const {
  createProduct,
  getFarmerProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProducts
} = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');

// Public routes (for customers to browse products)
router.get('/', getAllProducts);

// Protected routes (for farmers to manage their products)
router.post('/', authenticateToken, validateRequest(schemas.createProduct), createProduct);
router.get('/my-products', authenticateToken, getFarmerProducts);
router.get('/:id', authenticateToken, getProduct);
router.put('/:id', authenticateToken, validateRequest(schemas.updateProduct), updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

module.exports = router;
