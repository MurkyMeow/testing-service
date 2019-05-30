exports.up = knex =>
  knex.schema.table('test', table => {
    table.string('description');
  });

exports.down = knex =>
  knex.schema.table('test', table => {
    table.dropColumn('description');
  });
