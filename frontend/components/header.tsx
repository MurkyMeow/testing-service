import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useGlobalState, notify } from '../index';
import { Modal } from './modal';
import { AuthForm } from './form-auth';
import { Button } from './button';
import { User, useSelfQuery, useSignoutMutation } from '../graphql-types';

import './header.css';

type AuthType = 'signup' | 'signin'

export function Header() {
  const router = useRouter();

  const [user, setUser] = useGlobalState('user');
  const [formType, setFormType] = useState<AuthType>();

  const [signout] = useSignoutMutation();
  const selfQuery = useSelfQuery();

  useEffect(() => setUser(selfQuery.data?.self), [setUser, selfQuery.data]);

  const onSuccess = (newUser: User) => {
    setUser(newUser);
    setFormType(undefined);
  };

  const handleSignout = async () => {
    try {
      await signout();
      setUser(null);
      router.push('/');
    } catch (err) {
      console.error(err);
      notify('error', 'Не удаётся выйти. Попробуйте перезагрузить страницу');
    }
  };

  return (
    <header className="header">
      {formType && (
        <Modal onClose={() => setFormType(undefined)}>
          <AuthForm type={formType} onSuccess={onSuccess}/>
        </Modal>
      )}
      <a className="header__logo" href="/">Nice header there</a>
      {user ? <>
        <Button className="header__navBtn" link="/categories">Категории</Button>
        {user.role === 'admin' && (
          <Button className="header__navBtn" link="/moderation">Модерация</Button>
        )}
        <nav className="header__auth">
          <Button className="header__navBtn" link="/profile">
            {user.name ? user.name : 'Профиль'}
          </Button>
          <Button className="header__navBtn" onClick={handleSignout}>
            Выйти
          </Button>
        </nav>
      </> : (
        <nav className="header__auth">
          <Button className="header__navBtn" onClick={() => setFormType('signup')}>
            Создать аккаунт
          </Button>
          <Button className="header__navBtn" onClick={() => setFormType('signin')}>
            Войти
          </Button>
        </nav>
      )}
    </header>
  );
}
