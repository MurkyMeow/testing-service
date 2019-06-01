exports.seed = async knex => {
  await knex('category').insert([
    { name: 'Курс 1', creator_id: 1 },
    { name: 'Курс 2', creator_id: 1 },
    { name: 'Методические тесты', creator_id: 1 },
  ]);
  await knex('test').insert([
    { category_id: 1, name: 'Тест на конфликтность', creator_id: 1 },
    { category_id: 1, name: 'Тест на уверенность', creator_id: 1 },
    { category_id: 1, name: 'Тест на страстность', creator_id: 1 },
    { category_id: 1, name: 'Тест на оптимизм', creator_id: 1 },
    { category_id: 1, name: 'Тест на смелость', creator_id: 1 },
    { category_id: 2, name: 'Тест на организаторские способности', creator_id: 1 },
    { category_id: 2, name: 'Тест на самоуправление', creator_id: 1 },
    { category_id: 2, name: 'Тест на находчивость', creator_id: 1 },
    { category_id: 2, name: 'Тест на честолюбие', creator_id: 1 },
    { category_id: 2, name: 'Тест на предпринимательскую креативность', creator_id: 1 },
    { category_id: 2, name: 'Тест на умение принимать решения', creator_id: 1 },
    { category_id: 2, name: 'Тест на толерантность', creator_id: 1 },
    { category_id: 2, name: 'Тест на этику поведения в бизнесе', creator_id: 1 },
    { category_id: 2, name: 'Тест работодателя', creator_id: 1 },
    { category_id: 3, name: 'Адаптивность', creator_id: 1 },
    { category_id: 3, name: 'Методика "Мотивы профессиональной деятельности"', creator_id: 1 },
    { category_id: 3, name: 'Методика "Личностная готовность к переменам"', creator_id: 1 },
    { category_id: 3, name: 'Опросник "Карьерные ориентации"', creator_id: 1 },
  ]);
  await knex('question').insert([
    { test_id: 1, text: 'Быть или не быть?' },
    { test_id: 1, text: 'Почему яблоко упало на ученного?' },
    { test_id: 1, text: 'Как перестать думать о белом тигре?' },
    { test_id: 1, text: 'Вы любите ананасы?' },
    { test_id: 1, text: 'Вы любите ананасы?' },
    { test_id: 11, text: 'Вам часто кажется, что у вас все получиться?' },
    { test_id: 11, text: 'Вы уверенный в себе человек?' }
  ]);
  await knex('answer').insert([
    { question_id: 3, text: 'вспомнить о зеленой обезьяне', correct: 1 },
    { question_id: 3, text: 'я и так о нем не думаю, другие вещи затмевают его', correct: 1 },
    { question_id: 3, text: 'Понятия не имею, теперь сидит в башке', correct: 0 },
    { question_id: 3, text: 'прошу помощи зала', correct: 0 },
    { question_id: 2, text: 'Потому что Он лошара', correct: 0 },
    { question_id: 2, text: 'Физика преподнесла свое возмездие', correct: 1 },
    { question_id: 1, text: 'Быть', correct: 1 },
    { question_id: 1, text: 'Не быть', correct: 0 },
    { question_id: 7, text: 'Вы серьезно? У меня всегда всё получается, даже то, что не нужно.', correct: 1 },
    { question_id: 7, text: 'Ничего не получается, и вообще я лох', correct: 0 },
    { question_id: 5, text: 'Перемены - мое второе имя', correct: 1 },
    { question_id: 5, text: 'Я боюсь дестабилизации своей жизни', correct: 0 },
    { question_id: 4, text: 'Ананасы 0_о омг....', correct: 1 },
    { question_id: 4, text: 'беееее', correct: 0 },
    { question_id: 8, text: 'Я сама уверенность', correct: 1 },
    { question_id: 8, text: 'Я даже познакомиться стремаю, о чем Вы?', correct: 0 },
    { question_id: 6, text: 'Выгода', correct: 1 },
    { question_id: 6, text: 'Компромисс', correct: 1 },
  ]);
  await knex('conclusion').insert([
    { test_id: 1, min_score: 0, text: 'Вы можете избегать конфликты, но могли бы их еще и предотвращать' },
    { test_id: 1, min_score: 0.9, text: 'Любой конфликт не представляет для вас угрозы' },
  ]);
};
