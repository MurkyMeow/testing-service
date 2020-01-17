import gql from 'graphql-tag';
import { FormEvent } from 'react';
import { post } from '../api';
import { notify } from '../index';
import Button from './button';
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
  type: 'signup' | 'signup',
}) => {
  const [signin] = useMutation(SIGNIN);
  const [signup] = useMutation(SIGNUP);

  const handleSignin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      await signin({ variables: data });
    } catch (err) {
      notify('error', err.status === 400 ? 'Неправильный логин или пароль' : 'Не удаётся войти. Попробуйте перезагрузить страницу.');
    }
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      await signup({ variables: data });
    } catch (err) {
      notify('Не удаётся войти. Попробуйте перезагрузить страницу.');
    }
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      const endpoint = signup ? '/auth/signup' : '/auth/signin';
      const user = await post(endpoint, {
        email: data.get('email'),
        password: data.get('password'),
      });
    } catch (err) {
      if (err.status === 400) notify('error', 'Неправильный логин или пароль');
      else notify('error', 'Не удаётся войти. Попробуйте перезагрузить страницу.');
    }
  };

  return (
    <form className={css.auth} onSubmit={submit}>
      <div className={css.auth__header}>Заполните поля</div>
      <input className={css.auth__field} name="email" type="email" placeholder="Email" required/>
      <input className={css.auth__field} name="password" type="password" placeholder="Пароль" required/>
      )}
      <Button className={css.auth__btn}>Войти</Button>
    </form>
  );
};
