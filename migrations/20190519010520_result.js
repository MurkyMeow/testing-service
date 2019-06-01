exports.up = knex =>
  knex.schema.createTable('result', table => {
    table.increments('id').primary();
    table.integer('user_id').references('user.id');
    table.integer('test_id').references('test.id').onDelete('CASCADE');
    table.float('score').notNullable();
    table.timestamps(true, true);
  });

exports.down = knex =>
  knex.schema.dropTable('result');
