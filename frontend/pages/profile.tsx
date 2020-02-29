import { TestCard } from '../components/test-card';
import { Input } from '../components/input';
import { TestResult } from '../components/test-result';
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
    const { data } = await editProfile({
      variables: { input },
    });
    if (data) {
      dispatch({ type: 'set-user', payload: data.editProfile });
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
        initial={profile.name || (ours ? '' : `Пользователь №${profile.id}`)}
        onAlter={name => handleEdit({ name })}
      />
      {profile.results.length > 0 && <>
        <h3>Пройденные тесты:</h3>
        {profile.results.map(result => <TestResult result={result} key={result.id} />)}
      </>}
      {profile.tests.length > 0 && <>
        <h3 className="profile__tests-title">Опубликованные тесты:</h3>
        <div className="profile__tests">
          {profile.tests.map(test => (
            <TestCard className="profile__test" key={test.id}
              test={test}
              editable={profile.id === profile.id}
              onDelete={() => handleTestDelete(test.id)}
            />
          ))}
        </div>
      </>}
    </div>
  );
}
