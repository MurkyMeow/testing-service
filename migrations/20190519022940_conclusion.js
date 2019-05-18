exports.up = knex =>
  knex.schema.createTable('conclusion', table => {
    table.increments('id').primary();
    table.integer('test_id').notNullable().references('id').inTable('test');
    table.float('min_score').notNullable();
    table.string('text').notNullable();
    table.timestamps(true, true);
  });

exports.down = knex =>
  knex.schema.dropTable('conclusion');
