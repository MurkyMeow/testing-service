exports.up = knex =>
  knex.schema.createTable('question', table => {
    table.increments('id').primary();
    table.string('text').notNullable();
    table.integer('test_id').notNullable().references('id').inTable('test')
      .onDelete('CASCADE');
  });

exports.down = knex =>
  knex.schema.dropTable('question');
