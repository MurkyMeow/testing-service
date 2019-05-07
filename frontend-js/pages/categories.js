import { el, html } from '../index.js';
import button from '../components/button.js';
import listPage from '../abstract/list-page.js';

export default listPage({
  title: 'Категории',
  endpoint: '/test/categories?samples=10',
  colWidth: 500,
  template: el(({ name, id }) => html`
    <div class="category">
      <div class="category-name">${name}</div>
      <div class="category-description">Описание</div>
      <div class="category-summary">
        <div><i>info</i>6</div>
        <div><i>query_builder</i>60</div>
      </div>
      <div class="category-actions">
        ${button({ link: `#/category/${id}` })('Перейти')}
      </div>
    </div>
  `),
});
