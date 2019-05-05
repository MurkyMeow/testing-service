import { el, html } from '../index.js';
import button from '../components/button.js';
import listPage from '../abstract/list-page.js';

export default ({ query }) => listPage({
  title: 'Выберете тест:',
  endpoint: `/test/tests/?${query.id}`,
  test: console.log(query.id),
  colWidth: 300,
  template: el(({ name, id }) => html`
    <div class="test">
      <div class="test-name">${name}</div>
      <p>Описание</p>
      <p>${query.id}</p>
      ${button({ link: `#/questions/${id}/` })('Пройти тест')}
    </div>
  `),
});
