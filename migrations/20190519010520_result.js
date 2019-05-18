exports.up = knex =>
  knex.schema.createTable('result', table => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().references('id').inTable('user');
    table.integer('test_id').notNullable().references('id').inTable('test');
    table.float('score').notNullable();
    table.timestamps();
  });

exports.down = knex =>
  knex.schema.dropTable('result');
