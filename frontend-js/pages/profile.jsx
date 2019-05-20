import Link from 'next/link';
import { useGlobalState } from '../index';
import { get, useRequest, post } from '../api';
import { TestCard } from '../components/test-card';

const Profile = () => {
  const [user, setUser] = useGlobalState('user');
  const [, tests = []] = useRequest(() => get('/test/tests?samples=5&eager=questions'));
  const [, finished = []] = useRequest(() => get('/stats/tests'));

  const changeName = async e => {
    const { value } = e.target;
    if (user.name !== value) {
      await post('/stats/name/', { name: value });
      setUser({ ...user, name: value });
    }
  };
  return (
    <div className="profile">
      <input className="profile__name editable" placeholder="Сменить имя"
        defaultValue={user ? user.name : ''}
        onBlur={changeName}
      />
      {finished.length && <>
        <h3>Пройденные тесты:</h3>
        {finished.map(result => result.test && (
          <Link href={`/test?id=${result.test_id}`} key={result.id}>
            <div className="profile__finished-test" key={result.id}>
              {result.test.name} — {result.score * 100}%
            </div>
          </Link>
        ))}
      </>}
      <h3 className="profile__tests-title">Опубликованные тесты:</h3>
      <div className="profile__tests">
        {tests.map(test => (
          <TestCard className="profile__test" test={test} key={test.id}/>
        ))}
      </div>
    </div>
  );
};

export default Profile;
