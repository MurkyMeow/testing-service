exports.up = knex =>
  knex.schema.createTable('question', table => {
    table.increments('id').primary();
    table.string('text').notNullable();
    table.integer('test_id').references('test.id').onDelete('CASCADE');
  });

exports.down = knex =>
  knex.schema.dropTable('question');
