import { el, html, useEffect, useState } from '../index.js';
import { get } from '../api.js';
import button from '../components/button.js';
import listPage from '../abstract/list-page.js';

export default listPage({
  title: 'Категории',
  endpoint: '/test/categories?samples=10',
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
