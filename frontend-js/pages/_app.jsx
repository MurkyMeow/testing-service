import App, { Container } from 'next/app';
import { useState, useEffect } from 'react';
import { useModal } from '../components/modal';
import { useGlobalState } from '../index';
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
    const user = await post(signup ? '/auth/signup' : '/auth/signin', {
      email: email.value,
      password: password.value
    });
    onSuccess(user);
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

const Header = () => {
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
  return (
    <header className="app-header">
      <Modal>
        <AuthForm type={authType} onSuccess={onSuccess}/>
      </Modal>
      <a className="app-header-logo" href="/">Nice header there</a>
      <nav className="app-header-nav">
        {user ? <>
          <Button className="app-header-nav-btn" link="/categories">Категории</Button>
          <Button className="app-header-nav-btn" link="/profile">{user.name ? user.name : 'Профиль'}</Button>
        </> : <>
          <Button className="app-header-nav-btn" onClick={showForm('signup')}>Создать аккаунт</Button>
          <Button className="app-header-nav-btn" onClick={showForm('signin')}>Войти</Button>
        </>}
      </nav>
    </header>
  );
};

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    return Component.getInitialProps ? Component.getInitialProps(ctx) : {};
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Header/>
        <Component {...pageProps}/>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
      </Container>
    );
  }
}

export default MyApp;
