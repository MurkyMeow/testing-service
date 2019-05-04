import { el, html, useState, useEffect } from '../index.js';
import { get } from '../api.js';

const listPage = ({ title, endpoint, colWidth, template }) => el(() => {
  const [items, setItems] = useState([]);

  useEffect(async () => {
    const response = await get(endpoint);
    setItems(response);
  }, []);

  return html`
  <div class="list-page" style=${`--column-width: ${colWidth}px`}>
    <div class="list-page-title">${title}</div>
    <div class="list-page-items">${items.map(template)}</div>
  </div>
  `;
});

export default listPage;
