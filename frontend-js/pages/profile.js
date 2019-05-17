import { el, html, useGlobalState, useRequest, iter } from '../index.js';
import { get } from '../api.js';
import button from '../components/button.js';

const profile = el(() => {
  const [user] = useGlobalState('user');
  const [, data] = useRequest(() => get('/test/tests?samples=5'));

  return html`
    <div class="profile">
      <h1>${user ? user.name : ''}</h1>
      <h2>Тесты:</h2>
      <div class="profile-tests">
        ${iter(data, test => html`
          <div class="profile-test">
            <div class="profile-test-name">${test.name}</div>
            <div class="profile-test-stats">
              <i>remove_red_eye</i>20
            </div>
            <div class="profile-test-actions">
              ${button({ classname: 'profile-test-btn' })('Пройти')}
            </div>
          </div>
        `)}
      </div>
    </div>
  `;
});

export default profile;
