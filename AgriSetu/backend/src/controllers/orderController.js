const db = require('../config/database');
const { generateOrderNumber } = require('../utils/orderNumber');

const formatOrderRow = (order) => ({
  id: order.id,
  orderNumber: order.order_number,
  customerId: order.customer_id,
  farmerId: order.farmer_id,
  customerName: order.customer_name,
  farmerName: order.farmer_name,
  subtotal: parseFloat(order.subtotal),
  deliveryFee: parseFloat(order.delivery_fee || 0),
  taxAmount: parseFloat(order.tax_amount || 0),
  totalAmount: parseFloat(order.total_amount),
  status: order.status,
  paymentStatus: order.payment_status,
  deliveryCity: order.delivery_city,
  deliveryPhone: order.delivery_phone,
  createdAt: order.created_at,
  items: order.items || []
});

const createOrder = async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({
        status: 'error',
        message: 'Only customers can place orders'
      });
    }

    const {
      items,
      deliveryMethod = 'home_delivery',
      deliveryInstructions,
      deliveryAddressLine1,
      deliveryAddressLine2,
      deliveryCity,
      deliveryState,
      deliveryPostalCode,
      deliveryCountry = 'India',
      deliveryPhone
    } = req.body;

    const customerId = req.user.id;
    const productIds = items.map((i) => i.productId);
    const products = await db('products')
      .whereIn('id', productIds)
      .where({ is_available: true });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        status: 'error',
        message: 'One or more products are unavailable'
      });
    }

    const productMap = new Map(products.map((p) => [p.id, p]));
    const farmerGroups = new Map();

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) continue;
      const qty = item.quantity;
      if (qty < product.min_order_quantity) {
        return res.status(400).json({
          status: 'error',
          message: `Minimum order for ${product.name} is ${product.min_order_quantity}`
        });
      }
      if (product.max_order_quantity && qty > product.max_order_quantity) {
        return res.status(400).json({
          status: 'error',
          message: `Maximum order for ${product.name} is ${product.max_order_quantity}`
        });
      }
      if (qty > product.stock_quantity) {
        return res.status(400).json({
          status: 'error',
          message: `Insufficient stock for ${product.name}`
        });
      }

      const farmerId = product.farmer_id;
      if (!farmerGroups.has(farmerId)) {
        farmerGroups.set(farmerId, []);
      }
      farmerGroups.get(farmerId).push({ product, quantity: qty });
    }

    const createdOrders = [];
    const deliveryFeePerOrder = 50;
    const taxRate = 0.05;

    await db.transaction(async (trx) => {
      for (const [farmerId, lineItems] of farmerGroups) {
        let subtotal = 0;
        const orderItemsData = [];

        for (const { product, quantity } of lineItems) {
          const unitPrice = parseFloat(product.price);
          const lineTotal = unitPrice * quantity;
          subtotal += lineTotal;

          let mainImage = null;
          if (product.images) {
            try {
              const imgs = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
              mainImage = Array.isArray(imgs) ? imgs[0] : null;
            } catch {
              mainImage = null;
            }
          }

          orderItemsData.push({
            product,
            quantity,
            unitPrice,
            lineTotal,
            mainImage
          });
        }

        const taxAmount = subtotal * taxRate;
        const totalAmount = subtotal + deliveryFeePerOrder + taxAmount;
        const orderNumber = generateOrderNumber();

        await trx('orders').insert({
          order_number: orderNumber,
          customer_id: customerId,
          farmer_id: farmerId,
          subtotal,
          delivery_fee: deliveryFeePerOrder,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          status: 'pending',
          payment_status: 'pending',
          delivery_method: deliveryMethod,
          delivery_instructions: deliveryInstructions || null,
          delivery_address_line1: deliveryAddressLine1,
          delivery_address_line2: deliveryAddressLine2 || null,
          delivery_city: deliveryCity,
          delivery_state: deliveryState || 'Madhya Pradesh',
          delivery_postal_code: deliveryPostalCode,
          delivery_country: deliveryCountry,
          delivery_phone: deliveryPhone
        });

        const orderRow = await trx('orders').where({ order_number: orderNumber }).first();
        const resolvedOrderId = orderRow.id;

        for (const { product, quantity, unitPrice, lineTotal, mainImage } of orderItemsData) {
          await trx('order_items').insert({
            order_id: resolvedOrderId,
            product_id: product.id,
            product_name: product.name,
            product_description: product.description,
            unit_price: unitPrice,
            unit: product.unit,
            quantity,
            total_price: lineTotal,
            product_image: mainImage,
            is_organic: product.is_organic,
            origin: product.origin
          });

          await trx('products')
            .where({ id: product.id })
            .decrement('stock_quantity', quantity)
            .increment('total_orders', 1);
        }

        await trx('users').where({ id: customerId }).increment('customer_total_orders', 1);
        await trx('users').where({ id: farmerId }).increment('farmer_total_orders', 1);
        await trx('users').where({ id: customerId }).increment('total_spent', totalAmount);
        await trx('users').where({ id: farmerId }).increment('total_sales', totalAmount);

        createdOrders.push({
          id: resolvedOrderId,
          orderNumber,
          farmerId,
          totalAmount
        });
      }
    });

    res.status(201).json({
      status: 'success',
      message: `Created ${createdOrders.length} order(s)`,
      data: { orders: createdOrders }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create order',
      error: error.message
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const customerId = req.user.id;
    const orders = await db('orders')
      .select(
        'orders.*',
        db.raw("CONCAT(users.first_name, ' ', users.last_name) as farmer_name")
      )
      .join('users', 'orders.farmer_id', 'users.id')
      .where({ 'orders.customer_id': customerId })
      .orderBy('orders.created_at', 'desc');

    const orderIds = orders.map((o) => o.id);
    const items = orderIds.length
      ? await db('order_items').whereIn('order_id', orderIds)
      : [];

    const ordersWithItems = orders.map((order) => ({
      ...formatOrderRow(order),
      items: items.filter((i) => i.order_id === order.id)
    }));

    res.json({ status: 'success', data: { orders: ordersWithItems } });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch orders' });
  }
};

const getFarmerOrders = async (req, res) => {
  try {
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ status: 'error', message: 'Farmer access only' });
    }

    const orders = await db('orders')
      .select(
        'orders.*',
        db.raw("CONCAT(users.first_name, ' ', users.last_name) as customer_name")
      )
      .join('users', 'orders.customer_id', 'users.id')
      .where({ 'orders.farmer_id': req.user.id })
      .orderBy('orders.created_at', 'desc');

    res.json({
      status: 'success',
      data: { orders: orders.map(formatOrderRow) }
    });
  } catch (error) {
    console.error('Get farmer orders error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch orders' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await db('orders')
      .select(
        'orders.*',
        db.raw("CONCAT(c.first_name, ' ', c.last_name) as customer_name"),
        db.raw("CONCAT(f.first_name, ' ', f.last_name) as farmer_name")
      )
      .join({ c: 'users' }, 'orders.customer_id', 'c.id')
      .join({ f: 'users' }, 'orders.farmer_id', 'f.id')
      .orderBy('orders.created_at', 'desc');

    res.json({
      status: 'success',
      data: { orders: orders.map(formatOrderRow) }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = [
      'pending', 'confirmed', 'preparing', 'ready_for_delivery',
      'out_for_delivery', 'delivered', 'cancelled', 'refunded'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ status: 'error', message: 'Invalid status' });
    }

    const order = await db('orders').where({ id }).first();
    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order not found' });
    }

    if (req.user.role === 'farmer' && order.farmer_id !== req.user.id) {
      return res.status(403).json({ status: 'error', message: 'Not your order' });
    }

    const updateData = { status, updated_at: db.fn.now() };
    if (status === 'delivered') {
      updateData.delivered_at = db.fn.now();
    }
    if (status === 'cancelled') {
      updateData.cancelled_at = db.fn.now();
    }

    await db('orders').where({ id }).update(updateData);

    res.json({ status: 'success', message: 'Order status updated' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update order' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  getAllOrders,
  updateOrderStatus
};
