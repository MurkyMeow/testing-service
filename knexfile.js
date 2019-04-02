module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './system-testing.sqlite'
    },
    useNullAsDefault: true
  }
};
