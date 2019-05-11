import { el, html, useState, useEffect } from '../index.js';
import button from '../components/button.js';
import { get } from '../api.js';

const testingForm = el(({ query }) => {
  const [items, setItems] = useState([]);

  useEffect(async () => {
    const response = await get(`/test/questions?test_id=${query.id}&eager=answers`);
    setItems(response);
  }, []);

  return html`
  <div class="question">Вопрос: ${items.question}
    <div class="question-answers">Ответы:
      ${el(() => items.map(answers => html`
      <div>${answers.text}</div>
      `))}
      <div class="question-nav">
        <div>${button({ })('Предыдущий вопрос')}</div>
        <div>${button({ })('Следующий вопрос')}</div>
      </div>
      </div>
    </div>
    </div>
  `;
});

export default testingForm;
