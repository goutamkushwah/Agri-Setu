exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('phone').notNullable();
    table.enum('role', ['farmer', 'customer', 'admin']).notNullable();
    table.string('profile_image').nullable();
    table.text('bio').nullable();
    table.boolean('is_verified').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.string('verification_token').nullable();
    table.string('reset_password_token').nullable();
    table.timestamp('reset_password_expires').nullable();
    table.string('refresh_token').nullable();
    
    // Address fields
    table.string('address_line1').nullable();
    table.string('address_line2').nullable();
    table.string('city').nullable();
    table.string('state').nullable();
    table.string('postal_code').nullable();
    table.string('country').nullable();
    
    // Farmer-specific fields
    table.string('farm_name').nullable();
    table.text('farm_description').nullable();
    table.string('farm_address').nullable();
    table.string('farm_certifications').nullable();
    table.decimal('farm_rating', 3, 2).defaultTo(0);
    table.integer('farmer_total_orders').defaultTo(0);
    table.decimal('total_sales', 10, 2).defaultTo(0);
    
    // Customer-specific fields
    table.decimal('customer_rating', 3, 2).defaultTo(0);
    table.integer('customer_total_orders').defaultTo(0);
    table.decimal('total_spent', 10, 2).defaultTo(0);
    
    table.timestamps(true, true);
    
    // Indexes
    table.index(['email']);
    table.index(['role']);
    table.index(['is_active']);
    table.index(['is_verified']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
