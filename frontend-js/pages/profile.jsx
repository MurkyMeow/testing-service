import Link from 'next/link';
import { withRouter } from 'next/router';
import { useGlobalState } from '../index';
import { get, useRequest, post } from '../api';
import { TestCard } from '../components/test-card';

const Profile = ({ router }) => {
  const [user, setUser] = useGlobalState('user');
  const [loading, profile] = useRequest(() =>
    get(`/stats/profile?id=${router.query.id || ''}`)
  );

  const changeName = async e => {
    const { value } = e.target;
    if (user.name !== value) {
      await post('/stats/name/', { name: value });
      setUser({ ...user, name: value });
    }
  };
  if (loading) return <div className="page-title">Loading...</div>;
  return (
    <div className="profile">
      <input className="profile__name editable" placeholder="Сменить имя"
        disabled={user && user.id !== profile.id}
        defaultValue={profile.name || profile.id}
        onBlur={changeName}
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
