import Link from 'next/link';
import { withRouter } from 'next/router';
import { useGlobalState } from '../index';
import { get, useRequest, post } from '../api';
import { TestCard } from '../components/test-card';
import { Editable } from '../components/editable';

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
  return (
    <div className="profile">
      <Editable className="profile__name" placeholder="Сменить имя"
        disabled={user && user.id !== profile.id}
        initial={profile.name || profile.id}
        onAlter={changeName}
      />
      {profile.results.length > 0 && <>
        <h3>Пройденные тесты:</h3>
        {profile.results.map(result => result.test && (
          <Link href={`/test?id=${result.test_id}`} key={result.id}>
            <div className="profile__finished-test" key={result.id}>
              {result.test.name} — {result.score * 100}%
            </div>
          </Link>
        ))}
      </>}
      {profile.tests.length > 0 && <>
        <h3 className="profile__tests-title">Опубликованные тесты:</h3>
        <div className="profile__tests">
          {profile.tests.map(test => (
            <TestCard className="profile__test" test={test} key={test.id}/>
          ))}
        </div>
      </>}
    </div>
  );
};

export default withRouter(Profile);
