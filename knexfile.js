module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './system-testing.sqlite',
    },
    useNullAsDefault: true,
    pool: {
      afterCreate(conn, cb) {
        conn.run('PRAGMA foreign_keys = ON', cb);
      }
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    ssl: true,
  },
};
