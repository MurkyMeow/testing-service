exports.up = knex =>
  knex.schema.createTable('test', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.integer('category_id').unsigned().notNullable();
    table.foreign('category_id').references('id').inTable('category');
  });

exports.down = knex =>
  knex.schema.dropTable('test');
