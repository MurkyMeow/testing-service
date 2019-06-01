exports.up = knex =>
  knex.schema.table('test', table => {
    table.integer('creator_id').references('user.id');
  });

exports.down = knex =>
  knex.schema.table('test', table => {
    table.dropColumn('creator_id');
  });
