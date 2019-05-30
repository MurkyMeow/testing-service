exports.up = knex =>
  knex.schema.table('category', table => {
    table.string('description');
  });

exports.down = knex =>
  knex.schema.table('category', table => {
    table.dropColumn('description');
  });
