import { withRouter } from 'next/router';
import { useGlobalState } from '../index';
import { get, useRequest, post } from '../api';
import { TestCard } from '../components/test-card';
import { Editable } from '../components/editable';
import { TestResult } from '../components/test-result';

const Profile = ({ router }) => {
  const [user, setUser] = useGlobalState('user');
  const [status, profile] = useRequest(() =>
    get(`/stats/profile?id=${router.query.id || ''}`)
  );

  const changeName = async name => {
    await post('/stats/name/', { name });
    setUser({ ...user, name });
  };
  if (status.error === 404) return <div className="page-title">Этот профиль не существует =(</div>;
  if (status.error) return <div className="page-title">Не удалось загрузить профиль.</div>;
  if (!profile) return <div className="page-title">Загрузка...</div>;
  const ours = user && user.id === profile.id;
  return (
    <div className="profile">
      <h2>
        {profile.role === 'teacher' && 'Преподаватель'}
        {profile.role === 'admin' && 'Администратор'}
        {!profile.role && 'Студент'}
      </h2>
      <Editable className="profile__name" placeholder="Сменить имя"
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
        <h3 className="profile__tests-title">Опубликованные тесты:</h3>
        <div className="profile__tests">
          {profile.tests.map(test => (
            <TestCard className="profile__test" key={test.id}
              test={test}
              editable={profile.id === user.id}
            />
          ))}
        </div>
      </>}
    </div>
  );
};

export default withRouter(Profile);
