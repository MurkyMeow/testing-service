import { useRouter } from 'next/router';
import { useGlobalState } from '../index';
import { get, useRequest, post } from '../api';
import { TestCard } from '../components/test-card';
import { Input } from '../components/input';
import { TestResult } from '../components/test-result';
import css from './profile.css';

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useGlobalState('user');
  const [status, profile, setProfile] = useRequest(() =>
    get(`/stats/profile?id=${router.query.id || ''}`)
  );

  const changeName = async (name: string) => {
    await post('/stats/name/', { name });
    setUser({ ...user, name });
  };

  const handleTestDelete = (id: number) => {
    const tests = profile.tests.filter(x => x.id !== id);
    setProfile({ ...profile, tests });
  };

  if (status.error === 404) {
    return <div className={css.pageTitle}>Этот профиль не существует =(</div>;
  }
  if (status.error) {
    return <div className={css.pageTitle}>Не удалось загрузить профиль.</div>;
  }
  if (!profile) {
    return <div className={css.pageTitle}>Загрузка...</div>;
  }

  const ours = user && user.id === profile.id;
  return (
    <div className={css.pageProfile}>
      <h2>
        {profile.role === 'teacher' && 'Преподаватель'}
        {profile.role === 'admin' && 'Администратор'}
        {!profile.role && 'Студент'}
      </h2>
      <Input className={css.name} placeholder="Сменить имя"
        disabled={!ours}
        initial={profile.name || (ours ? '' : `Пользователь №${profile.id}`)}
        onAlter={changeName}
      />
      {profile.results.length > 0 && <>
        <h3>Пройденные тесты:</h3>
        {profile.results.map(result => result.test && (
          <TestResult result={result} key={result.id}/>
        ))}
      </>}
      {profile.tests.length > 0 && <>
        <h3 className={css.testsTitle}>Опубликованные тесты:</h3>
        <div className={css.tests}>
          {profile.tests.map(test => (
            <TestCard className={css.test} key={test.id}
              test={test}
              editable={profile.id === user.id}
              onDelete={() => handleTestDelete(test.id)}
            />
          ))}
        </div>
      </>}
    </div>
  );
}
