exports.up = knex =>
  knex.schema.createTable('user', table => {
    table.increments('id').primary();
    table.string('name');
    table.string('email');
    table.string('password');
    table.timestamps(true, true);
  });

exports.down = knex =>
  knex.schema.dropTable('user');
