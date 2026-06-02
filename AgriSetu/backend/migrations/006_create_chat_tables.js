exports.up = function (knex) {
  return knex.schema
    .createTable('chat_sessions', function (table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().nullable();
      table.string('guest_id', 64).nullable();
      table.timestamps(true, true);

      table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL');
      table.index(['user_id']);
      table.index(['guest_id']);
      table.index(['updated_at']);
    })
    .createTable('chat_messages', function (table) {
      table.increments('id').primary();
      table.integer('session_id').unsigned().notNullable();
      table.enum('role', ['user', 'assistant']).notNullable();
      table.text('content').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());

      table.foreign('session_id').references('id').inTable('chat_sessions').onDelete('CASCADE');
      table.index(['session_id']);
      table.index(['created_at']);
    });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('chat_messages').dropTableIfExists('chat_sessions');
};
