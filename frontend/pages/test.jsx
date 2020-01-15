import { useState } from 'react';
import produce from 'immer';
import { withRouter } from 'next/router';
import { useRequest, get, post } from '../api';
import Button from '../components/button';
import css from './test.css';

const Question = ({ data, checked, onToggle }) => (
  <div className={css.question}>
    <div className={css.question__title}>{data.text}</div>
    <div className={css.question__answers}>
      {data.answers.map(answer => (
        <label className={css.question__answer} key={answer.id}>
          <input type="checkbox"
            checked={checked.includes(answer.id)}
            onChange={() => onToggle(answer.id)}
          />
          <div>{answer.text}</div>
        </label>
      ))}
    </div>
  </div>
);

const Test = ({ router }) => {
  const { id } = router.query;
  const [slide, setSlide] = useState(0);
  const [, test] = useRequest(() => get(`/test/tests?id=${id}&include=name,questions(text,answers(text))`), { only: true });
  const [answers, setAnswers] = useState({});
  const finish = async () => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Вы уверены, что хотите завершить тест?')) return;
    await post('/test/answer', { testId: id, answers });
    router.push(`/result?test_id=${id}`);
  };
  const go = index => async () => {
    if (index > test.questions.length - 1) finish();
    else if (index >= 0) setSlide(index);
  };
  const checkAnswer = (questionId, answerId) => {
    setAnswers(produce(answers, _answers => {
      if (!answers[questionId]) _answers[questionId] = [];
      const answer = _answers[questionId];
      const index = answer.indexOf(answerId);
      if (index === -1) answer.push(answerId);
      else answer.splice(index, 1);
    }));
  };
  if (!test) return <div className={css.pageTitle}>Загрузка...</div>;
  return (
    <div className={css.pageTest}>
      <div className={css.pageTitle}>{test.name}</div>
      <div className={css.frame} style={{ '--slide-index': slide }}>
        <div className={css.navBtn} data-disabled={slide <= 0} onClick={go(slide - 1)}>←</div>
        {test.questions.map(question => (
          <Question data={question} key={question.id}
            checked={answers[question.id] || []}
            onToggle={answerId => checkAnswer(question.id, answerId)}
          />
        ))}
        <div className={css.navBtn} data-right="true" data-warning={slide >= test.questions.length - 1}
          onClick={go(slide + 1)}>
          →
        </div>
      </div>
      <div className={css.navigation}>
        {[...Array(test.questions.length).keys()].map(index => (
          <div data-active={index === slide} key={index} onClick={go(index)}/>
        ))}
      </div>
      <Button className={css.finishBtn} onClick={finish}>Завершить</Button>
    </div>
  );
};

export default withRouter(Test);
