import App, { Container } from 'next/app';
import { withRouter } from 'next/router';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
import { createUploadLink } from 'apollo-upload-client';
import { useState, useEffect } from 'react';
import { useModal } from '../components/modal';
import { useGlobalState, notify } from '../index';
import { get, post, useRequest } from '../api';
import Button from '../components/button';
import css from './app.css';

const AuthForm = ({ type, onSuccess }) => {
  const signup = type === 'signup';
  const submit = async e => {
    e.preventDefault();
    const data = new FormData(e.target);
    try {
      const endpoint = signup ? '/auth/signup' : '/auth/signin';
      const user = await post(endpoint, {
        email: data.get('email'),
        password: data.get('password'),
      });
      onSuccess(user);
    } catch (err) {
      if (err.status === 400) notify('error', 'Неправильный логин или пароль');
      else notify('error', 'Не удаётся войти. Попробуйте перезагрузить страницу.');
    }
  };
  const onConfirmChange = ({ target }) => {
    const validity = target.value !== target.previousSibling.value
      ? 'Пароли не совпадают'
      : '';
    target.setCustomValidity(validity);
  };
  return (
    <form className={css.auth} onSubmit={submit}>
      <div className={css.auth__header}>Заполните поля</div>
      <input className={css.auth__field} name="email" type="email" placeholder="Email" required/>
      <input className={css.auth__field} name="password" type="password" placeholder="Пароль" required/>
      {signup && (
        <input className={css.auth__field} name="passwordAgain" type="password" required
          placeholder="Повторите пароль"
          onChange={onConfirmChange}
        />
      )}
      <Button className={css.auth__btn}>Войти</Button>
    </form>
  );
};

const Header = ({ router }) => {
  const [user, setUser] = useGlobalState('user');
  const [authType, setAuthType] = useState('signup');
  const [Modal, showModal, hideModal] = useModal(false);
  const [, session] = useRequest(() => get('/auth/userinfo'));

  useEffect(() => setUser(session), [session]);

  const showForm = type => () => {
    setAuthType(type);
    showModal();
  };
  const onSuccess = newUser => {
    setUser(newUser);
    hideModal();
  };
  const signout = async () => {
    try {
      await post('/auth/signout');
      router.push('/');
      setUser(null);
    } catch (err) {
      console.error(err);
      notify('error', 'Не удаётся выйти. Попробуйте перезагрузить страницу');
    }
  };
  return (
    <header className={css.header}>
      <Modal>
        <AuthForm type={authType} onSuccess={onSuccess}/>
      </Modal>
      <a className={css.header__logo} href="/">Nice header there</a>
      {user ? <>
        <Button className={css.header__navBtn} link="/categories">Категории</Button>
        {user.role === 'admin' && (
          <Button className={css.header__navBtn} link="/moderation">Модерация</Button>
        )}
        <nav className={css.header__auth}>
          <Button className={css.header__navBtn} link="/profile">{user.name ? user.name : 'Профиль'}</Button>
          <Button className={css.header__navBtn} onClick={signout}>Выйти</Button>
        </nav>
      </> : (
        <nav className={css.header__auth}>
          <Button className={css.header__navBtn} onClick={showForm('signup')}>Создать аккаунт</Button>
          <Button className={css.header__navBtn} onClick={showForm('signin')}>Войти</Button>
        </nav>
      )}
    </header>
  );
};

const Notification = () => {
  const [{ type = 'hidden', timeout = 0, text }] = useGlobalState('notification', {});
  return (
    <div className={css.notification} data-type={type}
      style={{ '--duration': `${timeout || 0}ms` }}>
      <div className={css.notification__content}>{text}</div>
    </div>
  );
};

const uri = process.env.production
  ? '/graphql'
  // in dev mode the frontend is served not on the same port as the server
  : 'http://localhost:4000/graphql'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createUploadLink({ uri, credentials: 'include' }),
})

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    return Component.getInitialProps ? Component.getInitialProps(ctx) : {};
  }

  render() {
    const { Component, pageProps, router } = this.props;
    return (
      <Container>
        <ApolloProvider client={client}>
          <Notification/>
          <Header router={router}/>
          <Component {...pageProps}/>
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
        </ApolloProvider>
      </Container>
    );
  }
}

export default withRouter(MyApp);
