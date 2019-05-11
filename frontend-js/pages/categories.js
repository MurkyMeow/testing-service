import { el, html, useEffect, useState } from '../index.js';
import { get, put } from '../api.js';
import button from '../components/button.js';
import listPage from '../abstract/list-page.js';

const list = listPage({
  title: 'Категории',
  endpoint: '/test/categories?samples=30',
  colWidth: 500,
  template: el(({ name, id }) => {
    const [tests, setTests] = useState([]);
    useEffect(async () => {
      try {
        setTests(await get(`/test/tests?category_id=${id}`));
      } catch (err) {
        console.error(err);
      }
    }, []);
    return html`
    <div class="category">
      <div class="category-name">${name}</div>
      <div class="category-test-list">
        ${el(() => tests.map(test => html`
          <div class="category-test-list-item">${test.name}</div>
        `))}
        <div class="category-test-list-add-btn">Добавить тест</div>
      </div>
      <div class="category-summary">
        <div><i>info</i>6</div>
        <div><i>query_builder</i>60</div>
      </div>
      <div class="category-actions">
        ${button({ link: `#/tests/${id}/` })('Перейти')}
      </div>
    </div>
    `;
  }),
});

export default el(() => {
  const [name, setName] = useState('');
  const submit = async () => {
    try {
      await put('/test/categories', { name });
    } catch (err) {
      console.error(err);
    }
  };
  return [
    list(),
    html`
    <div class="categories-add">
      <input class="categories-add-input" placeholder="Название категории"
        onchange=${e => setName(e.target.value)}>
      ${button({ classname: 'categories-add-btn', click: submit })('+')}
    </div>
    `
  ];
});
