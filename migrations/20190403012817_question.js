exports.up = knex =>
  knex.schema.createTable('question', table => {
    table.increments('id').primary();
    table.string('text').notNullable();
    table.integer('test_id').unsigned().notNullable();
    table.foreign('test_id').references('id').inTable('test');
  });

exports.down = knex =>
  knex.schema.dropTable('question');
