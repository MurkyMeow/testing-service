import Link from 'next/link';
import { Button } from './button';
import { canEdit } from '../index';
import { TestResult } from './test-result';
import css from './test-card.css';

export function TestCard(props: {
  className?: string;
  test: unknown;
  editable?: boolean;
  onDelete?: () => void;
}) {
  return (
    <div className={`${css.testCard} ${props.className || ''}`}>
      <div className={css.summary}>
        {(props.editable || canEdit(test)) && <>
          <Link href={`/test_edit?id=${test.id}`}>
            <i className={css.editBtn}>edit</i>
          </Link>
          <button className={css.deleteBtn} onClick={props.onDelete}>
            <i>close</i>
          </button>
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
