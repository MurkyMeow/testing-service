import { el, html, useState, useEffect, useGlobalState } from '../index.js';
import { post, get } from './api.js';
import categories from './pages/categories.js';
import tests from './pages/category.js';
import profile from './pages/profile.js';
import button from './components/button.js';
import useModal from './components/modal.js';
import testingForm from './pages/testing.js';

const notFound = el(() => html`
  <h1>Page not found</h1>
`);

const routes = [
  {
    regex: /^\/$/,
    component: notFound,
  },
  {
    regex: /^\/categories$/,
    component: categories,
  },
  {
    regex: /^\/profile$/,
    component: profile,
  },
  {
    regex: /^\/tests\/(\d+)\/$/,
    component: tests,
    params: ['id'],
  },
  {
    regex: /^\/questions\/(\d+)\/$/,
    component: testingForm,
    params: ['id'],
  }
];

const getPage = () => {
  const path = document.location.hash.slice(1);
  for (const route of routes) {
    const [match, ...args] = path.match(route.regex) || [];
    if (match) {
      const query = route.params
        ? route.params.reduce((acc, param, i) => ({ ...acc, [param]: args[i] }), {})
        : [];
      return route.component({ query });
    }
  }
  return notFound();
};

const authForm = el(({ type, success }) => {
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
    success(user);
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
  const [user, setUser] = useGlobalState('user');
  const [page, setPage] = useState(getPage());
  const [url, setUrl] = useState('');
  const [authType, setAuthType] = useState('signup');
  const [modal, showModal, hideModal] = useModal(false);

  useEffect(async () => {
    window.onhashchange = () => {
      if (document.location.hash === url) return;
      setPage(getPage());
      setUrl(document.location.hash);
    };
    setUser(await get('/auth/userinfo'));
  }, []);

  const showForm = type => () => {
    setAuthType(type);
    showModal();
  };

  const onSuccess = newUser => {
    setUser(newUser);
    hideModal();
  };

  return html`
  <div class="app">
    ${modal(
      authForm({ type: authType, success: onSuccess })
    )}
    <header class="app-header">
      <a class="app-header-logo" href="#/">Nice header there</a>
      <nav class="app-header-nav">
      ${user ? [
          button({ classname: 'app-header-nav-btn', link: '#/categories' })('Категории'),
          button({ classname: 'app-header-nav-btn', link: '#/profile' })(user.name),
        ] : [
          button({ classname: 'app-header-nav-btn', click: showForm('signup') })('Создать аккаунт'),
          button({ classname: 'app-header-nav-btn', click: showForm('signin') })('Войти'),
        ]
      }
      </nav>
    </header>
    <div class="app-content">${page}</div>
  </div>
  `;
});

document.body.appendChild(app());
