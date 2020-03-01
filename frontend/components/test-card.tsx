import cx from 'classnames';
import Link from 'next/link';
import { Button } from './button';
import { canEdit } from '../index';
import './test-card.css';

export function TestCard(props: {
  className?: string;
  id: number;
  name: string;
  maxScore: number;
  results?: { id: number; score: number }[];
  questionsCount?: number;
  creator?: { id: number; name: string };
  editable?: boolean;
  onDelete?: () => void;
}) {
  return (
    <div className={cx('test-card', props.className || '')}>
      <div className="test-card__summary">
        {(props.editable || canEdit(test)) && <>
          <Link href={`/test_edit?id=${props.id}`}>
            <i className="test-card__edit-btn">edit</i>
          </Link>
          <button className="test-card__delete-btn" onClick={props.onDelete}>
            <i>close</i>
          </button>
        </>}
        <div className="tests-card__name">{test.name}</div>
        {props.results && props.results.length > 0 && <>
          <div className="test-card__results-header">Результаты пользователей:</div>
          <div className="test-card__results">
            {props.results.map(res => (
              <div className="test-card__result" key={res.id}>
                {props.name} ({res.score} из {props.maxScore})
              </div>
            ))}
          </div>
        </>}
      </div>
      <div className="test-card__stats">
        {props.questionsCount && (
          <div><i>help_outline</i>{props.questionsCount}</div>
        )}
        <div><i>how_to_reg</i>76%</div>
        <Button className="test-card__link" link={`/test?id=${props.id}`}>
          Пройти тест
        </Button>
      </div>
      {props.creator && (
        <Link href={`/profile?id=${props.creator.id}`}>
          <span className="test-card__creator">Добавил: {props.creator.name}</span>
        </Link>
      )}
    </div>
  );
}
