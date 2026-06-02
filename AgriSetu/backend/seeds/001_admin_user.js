const bcrypt = require('bcryptjs');

/**
 * Seeds the single admin account. Set ADMIN_PASSWORD in .env before running:
 * npx knex seed:run
 */
exports.seed = async function (knex) {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn(
      'Skipping admin seed: set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env (see .env.example)'
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await knex('users').where({ email }).first();

  const adminData = {
    email,
    password_hash: passwordHash,
    first_name: process.env.ADMIN_FIRST_NAME || 'Admin',
    last_name: process.env.ADMIN_LAST_NAME || 'User',
    phone: '9876543210',
    role: 'admin',
    is_verified: true,
    is_active: true,
    address_line1: 'Admin Office, Agri-Setu',
    address_line2: '',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    postal_code: '462001',
    country: 'India'
  };

  if (existing) {
    await knex('users').where({ email }).update({
      ...adminData,
      updated_at: knex.fn.now()
    });
    console.log('Admin user updated:', email);
  } else {
    await knex('users').insert(adminData);
    console.log('Admin user created:', email);
  }
};
