import './question.css';

export function Question(props: {
  className?: string;
  text: string;
  checked: number[];
  answers: { id: number; text: string }[];
  onAnswerToggle: (answerId: number) => void;
}) {
  return (
    <div className={`question ${props.className || ''}`}>
      <div className="question__title">{props.text}</div>
      <div className="question__answers">
        {props.answers.map(answer => (
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
