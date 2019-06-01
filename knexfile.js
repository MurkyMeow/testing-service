module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './system-testing.sqlite'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'pg',
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
};
