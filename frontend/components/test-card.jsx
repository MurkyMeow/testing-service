import Link from 'next/link';
import Button from './button';
import { remove } from '../api';
import { canEdit, notify } from '../index';
import { TestResult } from './test-result';
import css from './test-card.css';

export function TestCard({ className, test, editable, onDelete }) {
  const removeItem = async () => {
    remove(`/test/tests?id=${test.id}`)
      .then(onDelete)
      .catch(() => notify('error', 'При удалении возникла ошибка'));
  };
  return (
    <div className={`${css.testCard} ${className}`}>
      <div className={css.summary}>
        {(editable || canEdit(test)) && <>
          <Link href={`/test_edit?id=${test.id}`}>
            <i className={css.editBtn}>edit</i>
          </Link>
          <i className={css.deleteBtn} onClick={removeItem}>close</i>
        </>}
        <div className={css.name}>{test.name}</div>
        {test.results && test.results.length > 0 && <>
          <div className={css.resultsHeader}>Результаты пользователей:</div>
          <div className={css.results}>
            {test.results.map(res => (
              <TestResult result={res} key={res.id}/>
            ))}
          </div>
        </>}
      </div>
      <div className={css.stats}>
        {test.questions && (
          <div><i>help_outline</i>{test.questions.length}</div>
        )}
        <div><i>how_to_reg</i>76%</div>
        <Button className={css.link} link={`/test?id=${test.id}`}>
          Пройти тест
        </Button>
      </div>
      {test.creator && (
        <Link href={`/profile?id=${test.creator.id}`}>
          <span className={css.creator}>Добавил: {test.creator.name}</span>
        </Link>
      )}
    </div>
  );
}
