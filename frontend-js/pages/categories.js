import { el, html } from '../index.js';
import button from '../components/button.js';
import listPage from '../abstract/list-page.js';

export default listPage({
  title: 'Категории',
  endpoint: '/test/categories',
  colWidth: 300,
  template: el(({ name, id }) => html`
    <div class="category">
      <div class="category-name">${name}</h2>
      <p>Описание</p>
      ${button({ link: `#/category/${id}` })('Перейти')}
    </div>
  `),
});
