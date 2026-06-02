exports.up = function(knex) {
  return knex.schema.createTable('reviews', function(table) {
    table.increments('id').primary();
    table.integer('customer_id').unsigned().notNullable();
    table.integer('farmer_id').unsigned().notNullable();
    table.integer('product_id').unsigned().nullable();
    table.integer('order_id').unsigned().nullable();
    table.integer('rating').notNullable(); // 1-5 stars
    table.text('comment').nullable();
    table.json('images').nullable(); // Array of review images
    table.boolean('is_verified_purchase').defaultTo(false);
    table.boolean('is_helpful').defaultTo(false);
    table.integer('helpful_count').defaultTo(0);
    table.boolean('is_approved').defaultTo(true);
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('customer_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('farmer_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');
    table.foreign('order_id').references('id').inTable('orders').onDelete('CASCADE');
    
    // Indexes
    table.index(['customer_id']);
    table.index(['farmer_id']);
    table.index(['product_id']);
    table.index(['order_id']);
    table.index(['rating']);
    table.index(['is_approved']);
    table.index(['created_at']);
    
    // Unique constraint - one review per customer per order
    table.unique(['customer_id', 'order_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('reviews');
};
