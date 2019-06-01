exports.up = knex =>
  knex.schema.createTable('test', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.integer('category_id').references('category.id').onDelete('CASCADE');
  });

exports.down = knex =>
  knex.schema.dropTable('test');
