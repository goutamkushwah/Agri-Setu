exports.up = function(knex) {
  return knex.schema.createTable('orders', function(table) {
    table.increments('id').primary();
    table.string('order_number').unique().notNullable();
    table.integer('customer_id').unsigned().notNullable();
    table.integer('farmer_id').unsigned().notNullable();
    table.decimal('subtotal', 10, 2).notNullable();
    table.decimal('delivery_fee', 10, 2).defaultTo(0);
    table.decimal('tax_amount', 10, 2).defaultTo(0);
    table.decimal('total_amount', 10, 2).notNullable();
    table.enum('status', [
      'pending',
      'confirmed',
      'preparing',
      'ready_for_delivery',
      'out_for_delivery',
      'delivered',
      'cancelled',
      'refunded'
    ]).defaultTo('pending');
    table.enum('payment_status', ['pending', 'paid', 'failed', 'refunded']).defaultTo('pending');
    table.string('payment_method').nullable();
    table.string('payment_intent_id').nullable(); // Stripe payment intent ID
    table.text('delivery_instructions').nullable();
    table.string('delivery_method').defaultTo('home_delivery'); // home_delivery, pickup
    table.timestamp('delivery_date').nullable();
    table.timestamp('delivered_at').nullable();
    table.timestamp('cancelled_at').nullable();
    table.text('cancellation_reason').nullable();
    
    // Delivery address
    table.string('delivery_address_line1').notNullable();
    table.string('delivery_address_line2').nullable();
    table.string('delivery_city').notNullable();
    table.string('delivery_state').notNullable();
    table.string('delivery_postal_code').notNullable();
    table.string('delivery_country').defaultTo('India');
    table.string('delivery_phone').notNullable();
    table.decimal('delivery_latitude', 10, 8).nullable();
    table.decimal('delivery_longitude', 11, 8).nullable();
    
    // Tracking
    table.string('tracking_number').nullable();
    table.text('delivery_notes').nullable();
    
    table.timestamps(true, true);
    
    // Foreign keys
    table.foreign('customer_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('farmer_id').references('id').inTable('users').onDelete('CASCADE');
    
    // Indexes
    table.index(['customer_id']);
    table.index(['farmer_id']);
    table.index(['status']);
    table.index(['payment_status']);
    table.index(['order_number']);
    table.index(['created_at']);
    table.index(['delivery_date']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('orders');
};
