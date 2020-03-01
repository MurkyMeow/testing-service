import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '../components/button';
import { Question } from '../components/question';
import { useGetTestQuery, useAnswerMutation } from '../graphql-types';
import './test.css';

interface Answer {
  questionId: number;
  answerId: number;
}

export default function Test() {
  const router = useRouter();
  const id = Number(router.query.id);

  const [slide, setSlide] = useState(0);

  const getTestQuery = useGetTestQuery();
  const [sendAnswers] = useAnswerMutation();

  const [answers, setAnswers] = useState<Answer[]>([]);
  
  const test = getTestQuery.data?.getTest;

  if (!test) return <div className="page-title">Загрузка...</div>;

  const finish = async () => {
    if (!confirm('Вы уверены, что хотите завершить тест?')) return;
    await sendAnswers({
      variables: { testId: Number(id), answers },
    });
    router.push(`/result?test_id=${id}`);
  };

  const go = (index: number) => {
    if (index > test.questions.length - 1) finish();
    else if (index >= 0) setSlide(index);
  };

  const checkAnswer = (questionId: number, answerId: number) => {
    setAnswers([...answers, { questionId, answerId }]);
  };

  return (
    <div className="page-test">
      <div className="page-title">{test.name}</div>
      <div className="page-test__frame" style={{ ['--slide-index' as any]: slide }}>
        <button className="page-test__nav-btn"
          data-disabled={slide <= 0}
          onClick={() => go(slide - 1)}>
          ←
        </button>
        {test.questions.map(question => (
          <Question className="page-test__question"
            key={question.id}
            question={question}
            checked={answers.filter(x => x.questionId === question.id).map(x => x.answerId)}
            onAnswerToggle={answerId => checkAnswer(question.id, answerId)}
          />
        ))}
        <button className="page-test__nav-btn"
          data-right="true"
          data-warning={slide >= test.questions.length - 1}
          onClick={() => go(slide + 1)}>
          →
        </button>
      </div>
      <div className="page-test__nav">
        {[...Array(test.questions.length).keys()].map(index => (
          <button className="page-test__nav-btn" key={index}
            data-active={index === slide}
            onClick={() => go(index)}
          />
        ))}
      </div>
      <Button className="page-test__finish-btn" onClick={finish}>Завершить</Button>
    </div>
  );
}
