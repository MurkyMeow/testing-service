import Link from 'next/link';
import { FormEvent } from 'react';
import { notify } from '../index';
import { useRequest, get, post } from '../api';
import { Button } from '../components/button';
import css from './moderation.css';

export default function Moderation() {
  const [, teachers = [], setTeachers] = useRequest((() =>
    get('/stats/profiles?role=teacher')
  ));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const id = Number(data.get('id'));
    if (teachers.some(x => x.id === id)) {
      return notify('error', 'Данный пользователь уже присутствует в списке');
    }
    try {
      const teacher = await post('/stats/assign', { id, role: 'teacher' });
      setTeachers([...teachers, teacher]);
    } catch (err) {
      switch (err.status) {
        case 404: return notify('error', 'Указанный пользователь не найден');
        case 400: return notify('error', 'Нельзя поменять собственную роль');
        default: return notify('error', 'Не удалось назначить пользователя');
      }
    }
    e.currentTarget.reset();
  };

  const unassign = async (id: number) => {
    try {
      await post('/stats/assign', { id, role: '' });
      setTeachers(teachers.filter(x => x.id !== id));
    } catch (err) {
      notify('error', 'Не удалось разжаловать пользователя');
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
