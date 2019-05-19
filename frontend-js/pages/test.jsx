import { useState } from 'react';
import { withRouter } from 'next/router';
import { useRequest, get, post } from '../api';
import Button from '../components/button';

const Question = ({ data, onAnswer }) => (
  <div className="test-page__question">
    <div className="test-page__question__title">{data.text}</div>
    <div className="test-page__question__answers">
      {data.answers.map(answer => (
        <label className="test-page__question__answers__item" key={answer.id}>
          <input name={`name--${data.id}`} type="radio"
            onInput={() => onAnswer(answer.id)}
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
  const [loading, test] = useRequest(() => get(`/test/tests?id=${id}&eager=[questions.answers]`), { only: true });
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
  if (loading) return <div className="page-title">Загрузка...</div>;
  return (
    <div className="test-page">
      <div className="page-title">{test.name}</div>
      <div className="test-page__frame" style={{ '--slide-index': slide }}>
        <div className={`test-page__nav-btn ${slide <= 0 ? '--disabled' : ''}`}
          onClick={go(slide - 1)}>
            ←
        </div>
        {test.questions.map(question => (
          <Question data={question} key={question.id}
            onAnswer={answerId => setAnswers({ ...answers, [question.id]: answerId })}
          />
        ))}
        <div className={`test-page__nav-btn --right ${slide >= test.questions.length - 1 ? '--warning' : ''}`}
          onClick={go(slide + 1)}>
          →
        </div>
      </div>
      <div className="test-page__navigation">
        {[...Array(test.questions.length).keys()].map(index => (
          <div key={index}
            className={index === slide ? '--active' : ''}
            onClick={go(index)}/>
        ))}
      </div>
      <Button className="test-page__finish-btn" onClick={finish}>Завершить</Button>
    </div>
  );
};

export default withRouter(Test);
