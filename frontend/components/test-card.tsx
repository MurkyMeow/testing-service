import cx from 'classnames';
import Link from 'next/link';
import { Button } from './button';
import { canEdit } from '../index';
import { Test } from '../graphql-types';
import './test-card.css';

type OptionalTest = Test & {
  creator?: Test['creator'];
  results?: Test['results'];
  questions?: Test['questions'];
};

export function TestCard(props: {
  className?: string;
  test: OptionalTest;
  editable?: boolean;
  onDelete?: () => void;
}) {
  const { test } = props;
  return (
    <div className={cx('test-card', props.className || '')}>
      <div className="test-card__summary">
        {(props.editable || canEdit(test)) && <>
          <Link href={`/test_edit?id=${test.id}`}>
            <i className="test-card__edit-btn">edit</i>
          </Link>
          <button className="test-card__delete-btn" onClick={props.onDelete}>
            <i>close</i>
          </button>
        </>}
        <div className="tests-card__name">{test.name}</div>
        {test.results && test.results.length > 0 && <>
          <div className="test-card__results-header">Результаты пользователей:</div>
          <div className="test-card__results">
            {test.results.map(res => (
              <div className="test-card__result" key={res.id}>
                {test.name} ({res.score} из {test.maxScore})
              </div>
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
}
