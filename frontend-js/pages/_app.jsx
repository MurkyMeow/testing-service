import App, { Container } from 'next/app';
import { withRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useModal } from '../components/modal';
import { useGlobalState, notify } from '../index';
import { get, post, useRequest } from '../api';
import Button from '../components/button';
import '../style.css';

const AuthForm = ({ type, onSuccess }) => {
  const signup = type === 'signup';
  const submit = async e => {
    e.preventDefault();
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
    try {
      const user = await post(signup ? '/auth/signup' : '/auth/signin', {
        email: email.value,
        password: password.value
      });
      onSuccess(user);
    } catch (err) {
      if (err.status === 400) notify('error', 'Неправильный логин или пароль');
      else notify('error', 'Не удаётся войти. Попробуйте перезагрузить страницу.');
    }
  };
  return (
    <form className="app-auth">
      <div className="app-auth-header">Заполните поля</div>
      <input className="app-auth-field" name="email" placeholder="Email" required/>
      <input className="app-auth-field" name="password" placeholder="Пароль" required/>
      {signup && (
        <input className="app-auth-field" name="passwordAgain" placeholder="Повторите пароль" required/>
      )}
      <Button className="app-auth-btn" onClick={submit}>Войти</Button>
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
    <header className="app-header">
      <Modal>
        <AuthForm type={authType} onSuccess={onSuccess}/>
      </Modal>
      <a className="app-header-logo" href="/">Nice header there</a>
      {user ? <>
        <Button className="app-header-nav-btn" link="/categories">Категории</Button>
        <nav className="app-header-auth">
          <Button className="app-header-nav-btn" link="/profile">{user.name ? user.name : 'Профиль'}</Button>
          <Button className="app-header-nav-btn" onClick={signout}>Выйти</Button>
        </nav>
      </> : (
        <nav className="app-header-auth">
          <Button className="app-header-nav-btn" onClick={showForm('signup')}>Создать аккаунт</Button>
          <Button className="app-header-nav-btn" onClick={showForm('signin')}>Войти</Button>
        </nav>
      )}
    </header>
  );
};

const Notification = () => {
  const [{ type = 'hidden', timeout = 0, text }] = useGlobalState('notification', {});
  return (
    <div className={`notification --${type}`}
      style={{ '--duration': `${timeout || 0}ms` }}>
      <div className="notification__content">{text}</div>
    </div>
  );
};

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    return Component.getInitialProps ? Component.getInitialProps(ctx) : {};
  }

  render() {
    const { Component, pageProps, router } = this.props;
    return (
      <Container>
        <Notification/>
        <Header router={router}/>
        <Component {...pageProps}/>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
      </Container>
    );
  }
}

export default withRouter(MyApp);
