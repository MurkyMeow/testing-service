import { el, html, useState, useEffect } from '../index.js';
import { get } from '../api.js';
import button from '../components/button.js';

const test = el(({ name }) => html`
    <div class="test">
        <div class="test-name">${name}</div>
        <p>Описание</p>
        ${button({ link: '#/test/id' })('Пройти тест')}
    </div>
`);

const tests = el(() => {
  const [items, setItems] = useState([]);

  useEffect(async () => {
    const response = await get('/test/tests');
    setItems(response);
  }, []);

  return html`
    <div class="category-page">
        <h1 class="category-title">Category page</h1>
        <div class="category-list">${items.map(item => test(item))}</div>
    </div>
    `;
});
export default tests;
