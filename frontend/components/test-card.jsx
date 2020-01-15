import Link from 'next/link';
import Button from './button';
import { remove } from '../api';
import { canEdit, notify } from '../index';
import { TestResult } from './test-result';

export const TestCard = ({ className, test, editable, onDelete }) => {
  const removeItem = async () => {
    remove(`/test/tests?id=${test.id}`)
      .then(onDelete)
      .catch(() => notify('error', 'При удалении возникла ошибка'));
  };
  return (
    <div className={`test-card ${className}`}>
      <div className="test-card__summary">
        {(editable || canEdit(test)) && <>
          <Link href={`/test_edit?id=${test.id}`}>
            <i className="test-card__edit-btn">edit</i>
          </Link>
          <i className="test-card__delete-btn" onClick={removeItem}>close</i>
        </>}
        <div className="test-card__name">{test.name}</div>
        {test.results && test.results.length > 0 && <>
          <div className="test-card__results-header">Результаты пользователей:</div>
          <div className="test-card__results">
            {test.results.map(res => (
              <TestResult result={res} key={res.id}/>
            ))}
          </div>
        </>}
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
      {test.creator && (
        <Link href={`/profile?id=${test.creator.id}`}>
          <span className="test-card__creator">Добавил: {test.creator.name}</span>
        </Link>
      )}
    </div>
  );
};