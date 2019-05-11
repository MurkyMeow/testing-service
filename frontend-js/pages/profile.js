import { el, html, useGlobalState, useEffect, useState } from '../index.js';
import { get } from '../api.js';
import button from '../components/button.js';

const profile = el(() => {
  const [user] = useGlobalState('user');
  const [tests, setTests] = useState([]);

  useEffect(async () => {
    setTests(await get('/test/tests?samples=5'));
  }, []);

  return html`
    <div class="profile">
      <h1>${user ? user.name : ''}</h1>
      <h2>Тесты:</h2>
      <div class="profile-tests">
        ${el(() => tests.map(test => html`
          <div class="profile-test">
            <div class="profile-test-name">${test.name}</div>
            <div class="profile-test-stats">
              <i>remove_red_eye</i>20
            </div>
            <div class="profile-test-actions">
              ${button({ classname: 'profile-test-btn' })('Пройти')}
            </div>
          </div>
        `))}
      </div>
    </div>
  `;
});

export default profile;
