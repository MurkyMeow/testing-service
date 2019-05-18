import { useGlobalState } from '../index';
import { get, useRequest } from '../api';
import Button from '../components/button';

const Profile = () => {
  const [user] = useGlobalState('user');
  const [, data = []] = useRequest(() => get('/test/tests?samples=5'));

  return (
    <div className="profile">
      <h1>{user ? user.name : ''}</h1>
      <h2>Тесты:</h2>
      <div className="profile-tests">
        {data.map(test => (
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
