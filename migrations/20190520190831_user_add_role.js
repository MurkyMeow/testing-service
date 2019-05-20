exports.up = knex =>
  knex.schema.table('user', table => {
    table.string('role');
  });

exports.down = knex =>
  knex.schema.table('user', table => {
    table.dropColumn('role');
  });
