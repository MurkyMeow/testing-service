import { el, html, useState, useEffect } from '../index.js';
import { get } from '../api.js';
import button from '../components/button.js';

const category = el(({ name, id }) => html`
  <div class="category">
    <div class="category-name">${name}</h2>
    <p>Описание</p>
    ${button({ link: `#/category/${id}` })('Перейти')}
  </div>
`);

const categories = el(() => {
  const [items, setItems] = useState([]);

  useEffect(async () => {
    const response = await get('/test/categories');
    setItems(response);
  }, []);

  return html`
  <div class="categories-page">
    <h1 class="categories-title">Categories page</h1>
    <div class="categories-list">${items.map(item => category(item))}</div>
  </div>
  `;
});

export default categories;
