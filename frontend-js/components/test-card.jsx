import Link from 'next/link';
import Button from './button';
import { remove } from '../api';
import { useNotification } from './notification';

export const TestCard = ({ className, test, onDelete }) => {
  const [notification, notify] = useNotification();
  const removeItem = async () => {
    try {
      await remove(`/test/tests?id=${test.id}`);
      onDelete();
    } catch (err) {
      if (err.code === 403) notify('error', 'Отказано в доступе');
      else notify('error', 'При удалении возникла ошибка');
    }
  };
  return (
    <div className={`test-card ${className}`}>
      {notification}
      <div className="test-card__summary">
        <Link href={`/test_edit?id=${test.id}`}>
          <i className="test-card__edit-btn">edit</i>
        </Link>
        <i className="test-card__delete-btn" onClick={removeItem}>close</i>
        <div className="test-card__name">{test.name}</div>
        <div className="test-card__description">Описание</div>
      </div>
      <div className="test-card__stats">
        {test.questions && (
          <div><i>help_outline</i>{test.questions.length}</div>
        )}
        <div><i>how_to_reg</i>76%</div>
        <Button className="test-card__link" link={`/test?id=${test.id}`}>
          Пройти тест
        </Button>
      </div>
    </div>
  );
};
