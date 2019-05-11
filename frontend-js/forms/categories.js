import { el, html, useState } from '../index.js';
import button from '../components/button.js';
import { put } from '../api.js';

const categoryForm = el(() => {
  const [msg, setMsg] = useState('');
  const submit = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    try {
      await put('/test/categories', { name });
      setMsg('Категория успешно создана');
    } catch (err) {
      setMsg('Не удалось создать категорию');
    }
  };
  return html`
  <p>${msg}</p>
  <form class="category-add" onsubmit=${submit}>
    <div class="category-add-header">Введите название новой категории</div>
    <label>
      <input class="category-add-field" name="name" placeholder="Название категории" required>
      ${button({ classname: 'category-add-btn', click: submit })('Добавить категорию')}
    </label>
  </form>
  `;
});

export default categoryForm;
