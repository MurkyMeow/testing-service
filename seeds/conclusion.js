exports.seed = (knex, Promise) => Promise.all([
  knex('conclusion').insert([
    { test_id: 1, min_score: 0.5, text: 'Вы можете избегать конфликты, но могли бы их еще и предотвращать' },
    { test_id: 1, min_score: 0.9, text: 'Любой конфликт не представляет для вас угрозы' },
  ]),
]);
