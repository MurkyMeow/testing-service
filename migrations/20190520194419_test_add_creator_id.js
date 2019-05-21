exports.up = knex =>
  knex.schema.table('test', table => {
    table.integer('creator_id').references('id').inTable('user');
  });

exports.down = knex =>
  knex.schema.table('test', table => {
    table.dropColumn('creator_id');
  });
