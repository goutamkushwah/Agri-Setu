const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message,
        details: error.details
      });
    }
    next();
  };
};

// Validation schemas
const schemas = {
  // Auth validation
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    role: Joi.string().valid('farmer', 'customer').required(),
    farmName: Joi.when('role', {
      is: 'farmer',
      then: Joi.string().min(2).max(100).required(),
      otherwise: Joi.forbidden()
    }),
    addressLine1: Joi.string().min(5).max(200).required(),
    addressLine2: Joi.string().max(200).allow(''),
    city: Joi.string().min(2).max(50).required(),
    state: Joi.string().min(2).max(50).required(),
    postalCode: Joi.string().pattern(/^[0-9]{6}$/).required(),
    country: Joi.string().default('India')
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required()
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required()
  }),

  // Product validation
  createProduct: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    price: Joi.number().positive().precision(2).required(),
    unit: Joi.string().valid('kg', 'lb', 'piece', 'bunch', 'dozen', 'pack').required(),
    stockQuantity: Joi.number().integer().min(0).required(),
    minOrderQuantity: Joi.number().integer().min(1).default(1),
    maxOrderQuantity: Joi.number().integer().min(1),
    category: Joi.string().valid('vegetables', 'fruits', 'herbs', 'grains', 'dairy').required(),
    subcategory: Joi.string().max(50).allow(''),
    isOrganic: Joi.boolean().default(false),
    isFresh: Joi.boolean().default(true),
    weight: Joi.number().positive().precision(2),
    origin: Joi.string().max(100).allow(''),
    harvestDate: Joi.date().iso(),
    expiryDate: Joi.date().iso().greater('now'),
    storageInstructions: Joi.string().max(500).allow(''),
    preparationInstructions: Joi.string().max(500).allow('')
  }),

  updateProduct: Joi.object({
    name: Joi.string().min(2).max(100),
    description: Joi.string().min(10).max(1000),
    price: Joi.number().positive().precision(2),
    unit: Joi.string().valid('kg', 'lb', 'piece', 'bunch', 'dozen', 'pack'),
    stockQuantity: Joi.number().integer().min(0),
    minOrderQuantity: Joi.number().integer().min(1),
    maxOrderQuantity: Joi.number().integer().min(1),
    category: Joi.string().valid('vegetables', 'fruits', 'herbs', 'grains', 'dairy'),
    subcategory: Joi.string().max(50).allow(''),
    isOrganic: Joi.boolean(),
    isFresh: Joi.boolean(),
    isAvailable: Joi.boolean(),
    weight: Joi.number().positive().precision(2),
    origin: Joi.string().max(100).allow(''),
    harvestDate: Joi.date().iso(),
    expiryDate: Joi.date().iso().greater('now'),
    storageInstructions: Joi.string().max(500).allow(''),
    preparationInstructions: Joi.string().max(500).allow('')
  }),

  // Order validation
  createOrder: Joi.object({
    items: Joi.array().items(
      Joi.object({
        productId: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().positive().required()
      })
    ).min(1).required(),
    deliveryMethod: Joi.string().valid('home_delivery', 'pickup').default('home_delivery'),
    deliveryDate: Joi.date().iso().greater('now'),
    deliveryInstructions: Joi.string().max(500).allow(''),
    deliveryAddressLine1: Joi.string().min(5).max(200).required(),
    deliveryAddressLine2: Joi.string().max(200).allow(''),
    deliveryCity: Joi.string().min(2).max(50).required(),
    deliveryState: Joi.string().min(2).max(50).required(),
    deliveryPostalCode: Joi.string().pattern(/^[0-9]{6}$/).required(),
    deliveryCountry: Joi.string().default('India'),
    deliveryPhone: Joi.string().pattern(/^[0-9]{10}$/).required()
  }),

  // Review validation
  createReview: Joi.object({
    productId: Joi.number().integer().positive(),
    orderId: Joi.number().integer().positive().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().max(1000).allow(''),
    images: Joi.array().items(Joi.string().uri()).max(5)
  }),

  // Profile validation
  updateProfile: Joi.object({
    firstName: Joi.string().min(2).max(50),
    lastName: Joi.string().min(2).max(50),
    phone: Joi.string().pattern(/^[0-9]{10}$/),
    bio: Joi.string().max(500).allow(''),
    farmName: Joi.string().min(2).max(100).allow(''),
    farmDescription: Joi.string().max(1000).allow(''),
    farmAddress: Joi.string().max(200).allow(''),
    farmCertifications: Joi.string().max(500).allow(''),
    addressLine1: Joi.string().min(5).max(200),
    addressLine2: Joi.string().max(200).allow(''),
    city: Joi.string().min(2).max(50),
    state: Joi.string().min(2).max(50),
    postalCode: Joi.string().pattern(/^[0-9]{6}$/),
    country: Joi.string()
  })
};

module.exports = {
  validateRequest,
  schemas
};
