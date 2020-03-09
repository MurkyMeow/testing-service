import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Modal } from './modal';
import { AuthForm } from './form-auth';
import { Button } from './button';
import { useSelector, useDispatch } from '../store';
import { useToast } from './toast';
import { SelfQuery, useSelfQuery, useSignoutMutation } from '../graphql-types';

import './header.css';

type AuthType = 'signup' | 'signin'

export function Header() {
  const router = useRouter();

  const [formType, setFormType] = useState<AuthType>();

  const user = useSelector(s => s.user);
  const dispatch = useDispatch();

  const { notify } = useToast();

  const [signout] = useSignoutMutation();
  const selfQuery = useSelfQuery();

  useEffect(() => {
    dispatch({ type: 'set-user', payload: selfQuery.data?.self });
  }, [dispatch, selfQuery.data]);

  const onSuccess = useCallback((newUser: SelfQuery['self']) => {
    dispatch({ type: 'set-user', payload: newUser });
    setFormType(undefined);
  }, [dispatch, setFormType]);

  const handleSignout = async () => {
    try {
      await signout();
      dispatch({ type: 'set-user', payload: undefined });
      router.push('/');
    } catch (err) {
      console.error(err);
      notify({ type: 'error', text: 'Не удаётся выйти. Попробуйте перезагрузить страницу' });
    }
  };

  return (
    <header className="header">
      {formType && (
        <Modal onClose={() => setFormType(undefined)}>
          <AuthForm type={formType} onSuccess={onSuccess} />
        </Modal>
      )}
      <a className="header__logo" href="/">Nice header there</a>
      {user ? <>
        <Button className="header__nav-btn" link="/categories">Категории</Button>
        {user.role === 'admin' && (
          <Button className="header__nav-btn" link="/moderation">Модерация</Button>
        )}
        <nav className="header__auth">
          <Button className="header__nav-btn" link="/profile">
            {user.name ? user.name : 'Профиль'}
          </Button>
          <Button className="header__nav-btn" onClick={handleSignout}>
            Выйти
          </Button>
        </nav>
      </> : (
        <nav className="header__auth">
          <Button className="header__nav-btn" onClick={() => setFormType('signup')}>
            Создать аккаунт
          </Button>
          <Button className="header__nav-btn" onClick={() => setFormType('signin')}>
            Войти
          </Button>
        </nav>
      )}
    </header>
  );
}
