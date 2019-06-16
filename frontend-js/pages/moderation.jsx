import Link from 'next/link';
import { notify } from '../index';
import { useRequest, get, post } from '../api';
import Button from '../components/button';

export default () => {
  const [, teachers = [], setTeachers] = useRequest((() =>
    get('/stats/profiles?role=teacher')
  ));
  const submit = async e => {
    e.preventDefault();
    const [$id] = e.target;
    try {
      if (teachers.find(x => String(x.id) === $id.value)) {
        notify('error', 'Данный пользователь уже присутствует в списке');
      } else {
        const teacher = await post('/stats/assign', {
          id: $id.value,
          role: 'teacher',
        });
        setTeachers([...teachers, teacher]);
      }
    } catch (err) {
      switch (err.status) {
        case 404:
          notify('error', 'Указанный пользователь не найден');
          break;
        case 400:
          notify('error', 'Нельзя поменять собственную роль');
          break;
        default:
          notify('error', 'Не удалось назначить пользователя');
      }
    }
    $id.value = '';
  };
  const unassign = async id => {
    try {
      await post('/stats/assign', { id, role: '' });
      setTeachers(teachers.filter(x => x.id !== id));
    } catch (err) {
      notify('error', 'Не удалось разжаловать пользователя');
    }
  };
  return (
    <div className="page-moderation">
      <h2>Список преподавателей:</h2>
      {teachers.map(t => (
        <div className="page-moderation__teacher" key={t.id}>
          <Link href={`/profile?id=${t.id}`}>
            <a href="#">{t.name || 'Пользователь'} (id{t.id})</a>
          </Link>
          <Button onClick={() => unassign(t.id)}>Разжаловать</Button>
        </div>
      ))}
      <form className="page-moderation__form" onSubmit={submit}>
        <input placeholder="id"/>
        <Button>Добавить</Button>
      </form>
    </div>
  );
};
