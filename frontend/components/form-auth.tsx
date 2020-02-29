import { FormEvent } from 'react';
import { Button } from './button';
import { User, useSigninMutation, useSignupMutation } from 'frontend/graphql-types';
import { useDispatch } from '../store';

import './form-auth.css';

export function AuthForm(props: {
  type: 'signup' | 'signin';
  onSuccess: (arg: User) => void;
}) {
  const [signin] = useSigninMutation();
  const [signup] = useSignupMutation();

  const dispatch = useDispatch();

  const handleSignin = async (e: FormEvent<HTMLFormElement>) => {
    const data = new FormData(e.currentTarget);
    try {
      const res = await signin({
        variables: {
          email: String(data.get('email')),
          password: String(data.get('password')),
        },
      });
      if (res.data) props.onSuccess(res.data.signin);
    } catch (err) {
      if (err.status !== 400) throw err;
      dispatch({
        type: 'set-notification',
        payload: { type: 'error', text: 'Неправильный логин или пароль' },
      });
    }
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    const data = new FormData(e.currentTarget);
    const res = await signup({
      variables: {
        email: String(data.get('email')),
        name: String(data.get('name')),
        password: String(data.get('password')),
      },
    });
    if (res.data) props.onSuccess(res.data.signup);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (props.type === 'signup') {
        await handleSignup(e);
      } else {
        await handleSignin(e);
      }
    } catch (err) {
      dispatch({
        type: 'set-notification',
        payload: { type: 'error', text: 'Не удаётся войти. Попробуйте перезагрузить страницу.' },
      });
    }
  };

  return (
    <form className="auth" onSubmit={submit}>
      <div className="auth__header">Заполните поля</div>
      <input className="auth__field" name="email" type="email" placeholder="Email" required />
      <input className="auth__field" name="password" type="password" placeholder="Пароль" required />
      <Button className="auth__submit-btn">Войти</Button>
    </form>
  );
}
