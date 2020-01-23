import gql from 'graphql-tag';
import { FormEvent, useCallback } from 'react';
import { notify } from '../index';
import { Button } from './button';
import css from './form-auth.css';
import { useMutation } from '@apollo/react-hooks';

const SIGNUP = gql`
  mutation Signup($email: String!, $name: String!, password: String!) {
    signup(email: $email, name: $name, password: $password) {
      id
      name
      email
      role
    }
  }
`;
const SIGNIN = gql`
  mutation Signin($email: String!, password: String!) {
    signin(email: $email, password: $password) {
      id
      name
      email
      role
    }
  }
`;

export const AuthForm = (props: {
  type: 'signup' | 'signup';
}) => {
  const [signin] = useMutation(SIGNIN);
  const [signup] = useMutation(SIGNUP);

  const handleSignin = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      await signin({ variables: data });
    } catch (err) {
      if (err.status !== 400) throw err;
      notify('error', 'Неправильный логин или пароль');
    }
  }, [signin]);

  const handleSignup = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await signup({ variables: data });
  }, [signup]);

  const submit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (props.type === 'signup') {
        await handleSignup(e);
      } else {
        await handleSignin(e);
      }
    } catch (err) {
      notify('error', 'Не удаётся войти. Попробуйте перезагрузить страницу.');
    }
  }, [handleSignin, handleSignup, props.type]);

  return (
    <form className={css.auth} onSubmit={submit}>
      <div className={css.header}>Заполните поля</div>
      <input className={css.field} name="email" type="email" placeholder="Email" required/>
      <input className={css.field} name="password" type="password" placeholder="Пароль" required/>
      <Button className={css.submitBtn}>Войти</Button>
    </form>
  );
};
