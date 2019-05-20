import Link from 'next/link';
import Button from './button';
import { remove } from '../api';

export const TestCard = ({ className, test, onDelete }) => {
  const removeItem = async () => {
    await remove(`/test/tests?id=${test.id}`);
    onDelete();
  };
  return (
    <div className={`test-card ${className}`}>
      <div className="test-card__summary">
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
      <div className="test-card__stats">
        {test.questions && (
          <div><i>help_outline</i>{test.questions.length}</div>
        )}
        <div><i>how_to_reg</i>76%</div>
      </div>
    </div>
  );
};
