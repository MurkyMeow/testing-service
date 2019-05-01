import { el, html, useState, useEffect } from '../index.js';
import categories from './pages/categories.js';
import profile from './pages/profile.js';
import button from './components/button.js';

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

const app = el(() => {
  const [page, setPage] = useState(getPage());
  const [url, setUrl] = useState('');

  useEffect(() => {
    window.onhashchange = () => {
      if (document.location.hash === url) return;
      setPage(getPage());
      setUrl(document.location.hash);
    };
  }, []);

  return html`
  <div class="app">
    <header class="app-header">
      <a class="app-header-logo" href="#/">Nice header there</a>
      <nav class="app-header-nav">
        ${button({ classname: 'app-header-nav-btn', link: '#/' })('Категории')}
        ${button({ classname: 'app-header-nav-btn', link: '#/profile' })('Профиль')}
      </nav>
    </header>
    <div class="app-content">${page}</div>
  </div>
  `;
});

document.body.appendChild(app());
