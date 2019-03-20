const knex = require('knex');

// knex.schema.withSchema('SystemTesting');

knex.schema.createTable('accounts', (table) => {
  table.increments('id').notNullable();
  table.string('full_name');
  table.data('birthday');
  table.string('phone_number');
  table.string('email').notNullable();
  table.string('password');
  table.timestamps('account_created');
  table.string('email');
  table.int('type_id');
});

knex.schema.createTable('progress_accounts', (table) => {
  table.increments('id').notNullable();
  table.int('account_id');
  table.int('question_id');
  table.int('answer_id');
  table.boolean('checked');
  table.timestamps('answer_time');
});

knex.schema.createTable('answers', (table) => {
  table.increments('id').notNullable();
  table.int('question_id');
  table.string('answer');
  table.boolean('flag');
  table.timestamps('answer_time');
});

knex.schema.createTable('category', (table) => {
  table.increments('id').notNullable();
  table.string('category');
  table.boolean('flag');
  table.timestamps('answer_time');
});

knex.schema.createTable('questions', (table) => {
  table.increments('id').notNullable();
  table.int('test_id');
  table.string('question');
  table.timestamps('answer_time');
});

knex.schema.createTable('results', (table) => {
  table.increments('id').notNullable();
  table.int('test_id');
  table.real('precents');
  table.string('result');
  table.timestamps('answer_time');
});

knex.schema.createTable('tests', (table) => {
  table.increments('id').notNullable();
  table.int('category_id');
  table.string('test');
  table.timestamps('answer_time');
});
