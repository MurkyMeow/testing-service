import cx from 'classnames';
import { Question } from '../graphql-types';
import './question.css';

export function Question(props: {
  className?: string;
  question: Question;
  checked: number[];
  onAnswerToggle: (answerId: number) => void;
}) {
  const { question } = props;
  return (
    <div className={cx('question', props.className)}>
      <div className="question__title">{question.text}</div>
      <div className="question__answers">
        {question.answers.map(answer => (
          <label className="question__answer" key={answer.id}>
            <input className="question__answer-toggle"
              type="checkbox"
              checked={props.checked.includes(answer.id)}
              onChange={() => props.onAnswerToggle(answer.id)}
            />
            <div className="question__answer-text">{answer.text}</div>
          </label>
        ))}
      </div>
    </div>
  );
}
