import { el, html, useState, useEffect } from '../index.js';
import { get } from '../api.js';

const category = el(name => html`
  <div class="category">
    <h2>${name}</h2>
  </div>
`);

const categories = el(() => {
  const [items, setItems] = useState([]);

  useEffect(async () => {
    const response = await get('/test/categories');
    setItems(response);
  }, []);

  return html`
  <div>
    <h1>Categories page</h1>
    <div>${items.map(item => category(item.name))}</div>
  </div>
  `;
});

export default categories;
