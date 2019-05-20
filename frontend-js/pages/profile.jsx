import { useGlobalState } from '../index';
import { get, useRequest, post } from '../api';
import Button from '../components/button';

const Profile = () => {
  const [user, setUser] = useGlobalState('user');
  const [, tests = []] = useRequest(() => get('/test/tests?samples=5'));
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
      <h2>Пройденные тесты:</h2>
      {finished.map(result => result.test && (
        <div key={result.id}>{result.test.name} — {result.score * 100}%</div>
      ))}
      <h2>Тесты:</h2>
      <div className="profile-tests">
        {tests.map(test => (
          <div className="profile-test" key={test.id}>
            <div className="profile-test-name">{test.name}</div>
            <div className="profile-test-stats">
              <i>remove_red_eye</i>20
            </div>
            <div className="profile-test-actions">
              <Button className="profile-test-btn">Пройти</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
