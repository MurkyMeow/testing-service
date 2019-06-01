exports.up = knex =>
  knex.schema.createTable('answer', table => {
    table.increments('id').primary();
    table.string('text').notNullable();
    table.integer('correct').notNullable();
    table.integer('question_id').references('question.id').onDelete('CASCADE');
  });

exports.down = knex =>
  knex.schema.dropTable('answer');
