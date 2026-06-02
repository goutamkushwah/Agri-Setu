const db = require('../config/database');

const getStats = async (req, res) => {
  try {
    const totalUsers = await db('users').count('id as count').first();
    const customers = await db('users').where({ role: 'customer' }).count('id as count').first();
    const farmers = await db('users').where({ role: 'farmer' }).count('id as count').first();
    const admins = await db('users').where({ role: 'admin' }).count('id as count').first();

    const productCount = await db('products').count('id as count').first();
    const orderStats = await db('orders')
      .select(
        db.raw('COUNT(*) as total_orders'),
        db.raw('COALESCE(SUM(total_amount), 0) as revenue')
      )
      .first();

    const chatCount = await db('chat_sessions').count('id as count').first();

    res.json({
      status: 'success',
      data: {
        totalUsers: parseInt(totalUsers?.count || 0, 10),
        customers: parseInt(customers?.count || 0, 10),
        farmers: parseInt(farmers?.count || 0, 10),
        admins: parseInt(admins?.count || 0, 10),
        totalProducts: parseInt(productCount?.count || 0, 10),
        totalOrders: parseInt(orderStats?.total_orders || 0, 10),
        revenue: parseFloat(orderStats?.revenue || 0),
        totalChatSessions: parseInt(chatCount?.count || 0, 10)
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch stats' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await db('users')
      .select(
        'id',
        'email',
        'first_name',
        'last_name',
        'phone',
        'role',
        'is_verified',
        'is_active',
        'city',
        'state',
        'created_at'
      )
      .whereNot({ role: 'admin' })
      .orderBy('created_at', 'desc');

    res.json({
      status: 'success',
      data: {
        users: users.map((u) => ({
          id: u.id,
          email: u.email,
          name: `${u.first_name} ${u.last_name}`,
          phone: u.phone,
          role: u.role,
          isVerified: u.is_verified,
          isActive: u.is_active,
          city: u.city,
          state: u.state,
          createdAt: u.created_at
        }))
      }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch users' });
  }
};

module.exports = {
  getStats,
  getUsers
};
