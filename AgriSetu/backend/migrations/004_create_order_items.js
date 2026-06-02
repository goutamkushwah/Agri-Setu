exports.up = function(knex) {
  return knex.schema.createTable('order_items', function(table) {
    table.increments('id').primary();
    table.integer('order_id').unsigned().notNullable();
    table.integer('product_id').unsigned().notNullable();
    table.string('product_name').notNullable(); // Snapshot of product name
    table.text('product_description').nullable(); // Snapshot of product description
    table.decimal('unit_price', 10, 2).notNullable(); // Snapshot of price at time of order
    table.string('unit').notNullable(); // Snapshot of unit
    table.integer('quantity').notNullable();
    table.decimal('total_price', 10, 2).notNullable();
    table.string('product_image').nullable(); // Snapshot of main image
    table.boolean('is_organic').defaultTo(false); // Snapshot
    table.string('origin').nullable(); // Snapshot
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('order_id').references('id').inTable('orders').onDelete('CASCADE');
    table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');
    
    // Indexes
    table.index(['order_id']);
    table.index(['product_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('order_items');
};
