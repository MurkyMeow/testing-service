import Link from 'next/link';
import Button from './button';
import { remove } from '../api';

export const TestCard = ({ test, onDelete }) => {
  const removeItem = async () => {
    await remove(`/test/tests?id=${test.id}`);
    onDelete();
  };
  return (
    <div className="test-card">
      <Link href={`/test_edit?id=${test.id}`}>
        <i className="test-card__edit-btn">edit</i>
      </Link>
      <i className="test-card__delete-btn" onClick={removeItem}>close</i>
      <div className="test-card__name">{test.name}</div>
      <div className="test-card__description">Описание</div>
      <Button className="test-card__link" link={`/test?id=${test.id}`}>
        Пройти тест
      </Button>
    </div>
  );
};
