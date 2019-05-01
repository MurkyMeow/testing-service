import { el, html, useState, useEffect } from '../index.js';
import { post } from './api.js';
import categories from './pages/categories.js';
import profile from './pages/profile.js';
import button from './components/button.js';
import useModal from './components/modal.js';

const notFound = el(() => html`
  <h1>Page not found</h1>
`);

const getPage = () => {
  switch (document.location.hash.slice(1)) {
    case '/':
      return categories;
    case '/profile':
      return profile;
    default:
      return notFound;
  }
};

const authForm = el(type => {
  const signup = type === 'signup';
  const submit = async e => {
    const form = e.target.parentNode;
    const [email, password, passwordAgain] = form;
    if (!form.reportValidity()) return;
    if (signup) {
      if (password.value !== passwordAgain.value) {
        passwordAgain.setCustomValidity('Пароль не совпадает');
        passwordAgain.reportValidity();
        return;
      }
      passwordAgain.setCustomValidity('');
    }
    const user = await post(signup ? '/auth/signup' : '/auth/signin', {
      email: email.value,
      password: password.value
    });
    console.log(user);
  };
  return html`
  <form class="app-auth">
    <div class="app-auth-header">Заполните поля</div>
    <input class="app-auth-field" name="email" placeholder="Email" required>
    <input class="app-auth-field" name="password" placeholder="Пароль" required>
    ${signup ? html`
      <input class="app-auth-field" name="passwordAgain" placeholder="Повторите пароль" required>
    ` : ''}
    ${button({ classname: 'app-auth-btn', click: submit })('Войти')}
  </form>
  `;
});

const app = el(() => {
  const [page, setPage] = useState(getPage());
  const [url, setUrl] = useState('');
  const [authType, setAuthType] = useState('signup');
  const [modal, showModal] = useModal(false);

  useEffect(() => {
    window.onhashchange = () => {
      if (document.location.hash === url) return;
      setPage(getPage());
      setUrl(document.location.hash);
    };
  }, []);

  const showForm = type => () => {
    setAuthType(type);
    showModal();
  };

  return html`
  <div class="app">
    ${modal(authForm(authType))}
    <header class="app-header">
      <a class="app-header-logo" href="#/">Nice header there</a>
      <nav class="app-header-nav">
        ${button({ classname: 'app-header-nav-btn', link: '#/' })('Категории')}
        ${button({ classname: 'app-header-nav-btn', click: showForm('singup') })('Создать аккаунт')}
        ${button({ classname: 'app-header-nav-btn', click: showForm('signin') })('Войти')}
      </nav>
    </header>
    <div class="app-content">${page}</div>
  </div>
  `;
});

document.body.appendChild(app());
