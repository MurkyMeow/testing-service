import { TestCard } from '../components/test-card';
import { Input } from '../components/input';
import { useSelector, useDispatch } from '../store';
import { useGetProfileQuery, useEditProfileMutation, useDeleteTestMutation } from '../graphql-types';
import './profile.css';

export default function Profile() {
  const user = useSelector(s => s.user);
  const dispatch = useDispatch();

  const [editProfile] = useEditProfileMutation();
  const [deleteTest] = useDeleteTestMutation();
  const profileQuery = useGetProfileQuery();

  if (profileQuery.error?.message === '404') {
    return <div className="page-title">Этот профиль не существует =(</div>;
  }
  if (profileQuery.error) {
    return <div className="page-title">Не удалось загрузить профиль.</div>;
  }
  if (!profileQuery.data) {
    return <div className="page-title">Загрузка...</div>;
  }

  const profile = profileQuery.data.getProfile;
  const ours = user && user.id === profile.id;

  const handleEdit = async (input: { name: string }) => {
    if (!user) return;
    const { data } = await editProfile({
      variables: { input },
    });
    if (data) {
      dispatch({ type: 'set-user', payload: { ...user, ...data.editProfile } });
    }
  };

  const handleTestDelete = async (id: number) => {
    if (!user) return;
    await deleteTest({
      variables: { id },
    });
    const tests = user.tests.filter(x => x.id !== id);
    dispatch({
      type: 'set-user',
      payload: { ...user, tests },
    });
  };

  return (
    <div className="profile">
      <h2>
        {profile.role === 'teacher' && 'Преподаватель'}
        {profile.role === 'admin' && 'Администратор'}
        {!profile.role && 'Студент'}
      </h2>
      <Input className="profile__name" placeholder="Сменить имя"
        disabled={!ours}
        defaultValue={profile.name || (ours ? '' : `Пользователь №${profile.id}`)}
        onChange={e => handleEdit({ name: e.currentTarget.value })}
      />
      {profile.results.length > 0 && <>
        <h3>Пройденные тесты:</h3>
        {profile.results.map(result => (
          <div className="profile__result" key={result.id}>
            {result.test.name} ({result.score} из {result.test.maxScore})
          </div>
        ))}
      </>}
      {profile.tests.length > 0 && <>
        <h3 className="profile__tests-title">Опубликованные тесты:</h3>
        <div className="profile__tests">
          {profile.tests.map(test => (
            <TestCard className="profile__test" key={test.id}
              id={test.id}
              name={test.name}
              results={test.results}
              maxScore={test.maxScore}
              editable={profile.id === profile.id}
              questionsCount={test.questions.length}
              onDelete={() => handleTestDelete(test.id)}
            />
          ))}
        </div>
      </>}
    </div>
  );
}
