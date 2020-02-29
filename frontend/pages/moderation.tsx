import Link from 'next/link';
import { FormEvent } from 'react';
import { useNotification } from '../components/notification';
import { Button } from '../components/button';
import css from './moderation.css';

import {
  Role,
  useGetTeachersQuery,
  useChangeUserRoleMutation,
} from 'frontend/graphql-types';

export default function Moderation() {
  const teachersQuery = useGetTeachersQuery();
  const [changeRole] = useChangeUserRoleMutation();

  const { notify } = useNotification();

  if (teachersQuery.loading) {
    return <div>Загрузка...</div>;
  }

  if (!teachersQuery.data) {
    return <div>Не удалось загрузить список учителей</div>;
  }

  const teachers = teachersQuery.data.getProfilesByRole;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const id = Number(data.get('id'));
    if (teachers.some(x => x.id === id)) {
      return notify({ type: 'error', text: 'Данный пользователь уже присутствует в списке' });
    }
    try {
      await changeRole({
        variables: { id, role: Role.Teacher },
      });
      e.currentTarget.reset();
      teachersQuery.refetch();
    } catch (err) {
      switch (err.status) {
        case 404: return notify({ type: 'error', text: 'Указанный пользователь не найден' });
        case 400: return notify({ type: 'error', text: 'Нельзя поменять собственную роль' });
        default: return notify({ type: 'error', text: 'Не удалось назначить пользователя' });
      }
    }
    e.currentTarget.reset();
  };

  const unassign = async (id: number) => {
    try {
      await changeRole({
        variables: { id, role: Role.User },
      });
      teachersQuery.refetch();
    } catch (err) {
      notify({ type: 'error', text: 'Не удалось разжаловать пользователя' });
    }
  };

  return (
    <div className={css.pageModeration}>
      <h2>Список преподавателей:</h2>
      {teachers.map(t => (
        <div className={css.teacher} key={t.id}>
          <Link href={`/profile?id=${t.id}`}>
            <a>{t.name || 'Пользователь'} (id{t.id})</a>
          </Link>
          <Button onClick={() => unassign(t.id)}>Разжаловать</Button>
        </div>
      ))}
      <form className={css.form} onSubmit={submit}>
        <input placeholder="id"/>
        <Button>Добавить</Button>
      </form>
    </div>
  );
}
