const db = require('../config/database');

// Create a new product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      unit,
      stockQuantity,
      minOrderQuantity = 1,
      maxOrderQuantity,
      category,
      subcategory,
      isOrganic = false,
      isFresh = true,
      weight,
      origin,
      harvestDate,
      expiryDate,
      storageInstructions,
      preparationInstructions,
      images
    } = req.body;

    const farmerId = req.user.userId;

    // Check if farmer exists
    const farmer = await db('users').where({ id: farmerId, role: 'farmer' }).first();
    if (!farmer) {
      return res.status(403).json({
        status: 'error',
        message: 'Only farmers can create products'
      });
    }

    const productData = {
      name,
      description,
      price,
      unit,
      stock_quantity: stockQuantity,
      min_order_quantity: minOrderQuantity,
      max_order_quantity: maxOrderQuantity,
      category,
      subcategory,
      is_organic: isOrganic,
      is_fresh: isFresh,
      weight,
      origin,
      harvest_date: harvestDate,
      expiry_date: expiryDate,
      storage_instructions: storageInstructions,
      preparation_instructions: preparationInstructions,
      images: images ? JSON.stringify(images) : null,
      farmer_id: farmerId
    };

    const [productId] = await db('products').insert(productData);

    // Get the created product
    const product = await db('products')
      .select('*')
      .where({ id: productId })
      .first();

    // Parse images if they exist
    if (product.images) {
      product.images = JSON.parse(product.images);
    }

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// Get all products for a farmer
const getFarmerProducts = async (req, res) => {
  try {
    const farmerId = req.user.userId;
    const { page = 1, limit = 10, category, isAvailable } = req.query;

    let query = db('products')
      .select('*')
      .where({ farmer_id: farmerId });

    // Apply filters
    if (category) {
      query = query.where({ category });
    }
    if (isAvailable !== undefined) {
      query = query.where({ is_available: isAvailable === 'true' });
    }

    // Pagination
    const offset = (page - 1) * limit;
    query = query.limit(limit).offset(offset);

    const products = await query;

    // Parse images for each product
    products.forEach(product => {
      if (product.images) {
        product.images = JSON.parse(product.images);
      }
    });

    // Get total count for pagination
    let countQuery = db('products').where({ farmer_id: farmerId });
    if (category) {
      countQuery = countQuery.where({ category });
    }
    if (isAvailable !== undefined) {
      countQuery = countQuery.where({ is_available: isAvailable === 'true' });
    }
    const total = await countQuery.count('* as count').first();

    res.json({
      status: 'success',
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total.count),
          pages: Math.ceil(total.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get farmer products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// Get a single product by ID
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const farmerId = req.user.userId;

    const product = await db('products')
      .select('*')
      .where({ id, farmer_id: farmerId })
      .first();

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Parse images if they exist
    if (product.images) {
      product.images = JSON.parse(product.images);
    }

    res.json({
      status: 'success',
      data: { product }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const farmerId = req.user.userId;
    const updateData = req.body;

    // Check if product exists and belongs to farmer
    const existingProduct = await db('products')
      .where({ id, farmer_id: farmerId })
      .first();

    if (!existingProduct) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Prepare update data
    const productData = {};
    const allowedFields = [
      'name', 'description', 'price', 'unit', 'stockQuantity', 'minOrderQuantity',
      'maxOrderQuantity', 'category', 'subcategory', 'isOrganic', 'isFresh',
      'isAvailable', 'weight', 'origin', 'harvestDate', 'expiryDate',
      'storageInstructions', 'preparationInstructions', 'images'
    ];

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        switch (field) {
          case 'stockQuantity':
            productData.stock_quantity = updateData[field];
            break;
          case 'minOrderQuantity':
            productData.min_order_quantity = updateData[field];
            break;
          case 'maxOrderQuantity':
            productData.max_order_quantity = updateData[field];
            break;
          case 'isOrganic':
            productData.is_organic = updateData[field];
            break;
          case 'isFresh':
            productData.is_fresh = updateData[field];
            break;
          case 'isAvailable':
            productData.is_available = updateData[field];
            break;
          case 'harvestDate':
            productData.harvest_date = updateData[field];
            break;
          case 'expiryDate':
            productData.expiry_date = updateData[field];
            break;
          case 'storageInstructions':
            productData.storage_instructions = updateData[field];
            break;
          case 'preparationInstructions':
            productData.preparation_instructions = updateData[field];
            break;
          case 'images':
            productData.images = updateData[field] ? JSON.stringify(updateData[field]) : null;
            break;
          default:
            productData[field] = updateData[field];
        }
      }
    });

    await db('products').where({ id }).update(productData);

    // Get updated product
    const updatedProduct = await db('products')
      .select('*')
      .where({ id })
      .first();

    // Parse images if they exist
    if (updatedProduct.images) {
      updatedProduct.images = JSON.parse(updatedProduct.images);
    }

    res.json({
      status: 'success',
      message: 'Product updated successfully',
      data: { product: updatedProduct }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const farmerId = req.user.userId;

    // Check if product exists and belongs to farmer
    const product = await db('products')
      .where({ id, farmer_id: farmerId })
      .first();

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    await db('products').where({ id }).del();

    res.json({
      status: 'success',
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

// Get all products (for customers to browse)
const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, isOrganic, minPrice, maxPrice, search } = req.query;

    let query = db('products')
      .select(
        'products.*',
        'users.first_name as farmer_name',
        'users.farm_name',
        'users.city as farmer_city',
        'users.state as farmer_state'
      )
      .join('users', 'products.farmer_id', 'users.id')
      .where({ 'products.is_available': true });

    // Apply filters
    if (category) {
      query = query.where({ 'products.category': category });
    }
    if (isOrganic === 'true') {
      query = query.where({ 'products.is_organic': true });
    }
    if (minPrice) {
      query = query.where('products.price', '>=', minPrice);
    }
    if (maxPrice) {
      query = query.where('products.price', '<=', maxPrice);
    }
    if (search) {
      query = query.where(function() {
        this.where('products.name', 'like', `%${search}%`)
            .orWhere('products.description', 'like', `%${search}%`);
      });
    }

    // Pagination
    const offset = (page - 1) * limit;
    query = query.limit(limit).offset(offset);

    const products = await query;

    // Parse images for each product
    products.forEach(product => {
      if (product.images) {
        product.images = JSON.parse(product.images);
      }
    });

    // Get total count for pagination
    let countQuery = db('products')
      .join('users', 'products.farmer_id', 'users.id')
      .where({ 'products.is_available': true });

    if (category) {
      countQuery = countQuery.where({ 'products.category': category });
    }
    if (isOrganic === 'true') {
      countQuery = countQuery.where({ 'products.is_organic': true });
    }
    if (minPrice) {
      countQuery = countQuery.where('products.price', '>=', minPrice);
    }
    if (maxPrice) {
      countQuery = countQuery.where('products.price', '<=', maxPrice);
    }
    if (search) {
      countQuery = countQuery.where(function() {
        this.where('products.name', 'like', `%${search}%`)
            .orWhere('products.description', 'like', `%${search}%`);
      });
    }

    const total = await countQuery.count('* as count').first();

    res.json({
      status: 'success',
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total.count),
          pages: Math.ceil(total.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

module.exports = {
  createProduct,
  getFarmerProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProducts
};
