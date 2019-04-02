exports.up = knex =>
  knex.schema.createTable('progress', table => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('user');
    table.integer('answer_id').unsigned().notNullable();
    table.foreign('answer_id').references('id').inTable('answer');
    table.timestamps(true, true);
  });

exports.down = knex =>
  knex.schema.dropTable('progress');
