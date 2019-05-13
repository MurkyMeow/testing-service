import { el, html, useGlobalState, useEffect, useState } from '../index.js';
import { get, post } from '../api.js';
import button from '../components/button.js';

const profile = el(() => {
  const [user, setUser] = useGlobalState('user');
  const [name, setName] = useState('');
  const submit = async () => {
    try {
      await post('/auth/name', { name });
      setUser({ ...user, name });
    } catch (err) {
      console.error(err);
    }
    return { ok: true };
  };

  const [tests, setTests] = useState([]);

  useEffect(async () => {
    setTests(await get('/test/tests?samples=5'));
  }, []);

  return html`
    <div class="profile">
      <h1>${user ? user.name : ''}</h1>

      <p>Аккаунт:</p>
      <div class="profile-name-edit">
        <input class="profile-name-edit-input" placeholder="Новое имя"
          onchange=${e => setName(e.target.value)}>
        ${button({ classname: 'profile-name-edit-btn', click: submit })('Сохранить')}
      </div>

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
