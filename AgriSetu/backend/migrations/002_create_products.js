exports.up = function(knex) {
  return knex.schema.createTable('products', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.string('unit').notNullable(); // kg, lb, piece, bunch, dozen, pack
    table.integer('stock_quantity').defaultTo(0);
    table.integer('min_order_quantity').defaultTo(1);
    table.integer('max_order_quantity').nullable();
    table.string('category').notNullable(); // vegetables, fruits, herbs, grains, dairy
    table.string('subcategory').nullable();
    table.boolean('is_organic').defaultTo(false);
    table.boolean('is_fresh').defaultTo(true);
    table.boolean('is_available').defaultTo(true);
    table.decimal('weight', 8, 2).nullable();
    table.string('origin').nullable();
    table.date('harvest_date').nullable();
    table.date('expiry_date').nullable();
    table.text('storage_instructions').nullable();
    table.text('preparation_instructions').nullable();
    table.json('images').nullable(); // Array of image URLs
    table.decimal('rating', 3, 2).defaultTo(0);
    table.integer('total_reviews').defaultTo(0);
    table.integer('total_orders').defaultTo(0);
    table.integer('farmer_id').unsigned().notNullable();
    table.timestamps(true, true);
    
    // Foreign key constraint
    table.foreign('farmer_id').references('id').inTable('users').onDelete('CASCADE');
    
    // Indexes
    table.index(['farmer_id']);
    table.index(['category']);
    table.index(['is_available']);
    table.index(['is_organic']);
    table.index(['price']);
    table.index(['rating']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('products');
};