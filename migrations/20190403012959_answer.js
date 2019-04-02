exports.up = knex =>
  knex.schema.createTable('answer', table => {
    table.increments('id').primary();
    table.string('text').notNullable();
    table.integer('correct').notNullable();
    table.integer('question_id').unsigned().notNullable();
    table.foreign('question_id').references('id').inTable('question');
  });

exports.down = knex =>
  knex.schema.dropTable('answer');
