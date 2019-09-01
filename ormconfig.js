module.exports = {
  type: 'sqlite',
  database: './db.sqlite',
  synchronize: true,
  logging: false,
  entities: [
    'src/entity/**/*.ts',
  ],
  migrations: [
    'src/migration/**/*.ts'
  ],
  subscribers: [
    'src/subscriber/**/*.ts'
  ]
};
