import { useState, useReducer, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import produce from 'immer';
import { getKey, withKey } from '../index';
import { Input } from '../components/input';
import { Button } from '../components/button';
import { useNotification } from '../components/notification';
import './test_edit.css';

const makeAnswer = () => withKey({
  text: '',
  correct: false,
});
const makeQuestion = () => withKey({
  text: '',
  answers: [makeAnswer(), makeAnswer()],
});
const makeConclusion = (min_score = 0) => withKey({ text: '', min_score });

function ConclusionForm({ testId, initial, max }) {
  const [conclusions, setConclusions] = useState(initial);
  const [saved, setSaved] = useState(true);

  const { notify } = useNotification();

  useEffect(() => {
    setConclusions(initial);
  }, [initial]);

  const add = () => {
    setConclusions([...conclusions, makeConclusion()]);
  };
  const setScore = (index, min_score) => {
    setConclusions(conclusions.map((el, i) => i === index
      ? { ...el, min_score }
      : el
    ));
  };
  const setText = (index, text) => {
    setConclusions(conclusions.map((el, i) => i === index
      ? { ...el, text }
      : el
    ));
  };
  const close = index => {
    setConclusions(conclusions.filter((_, i) => index !== i));
  };
  const getOptions = () =>
    [...Array(max + 1).keys()].map(makeConclusion);

  const save = async () => {
    try {
      await patch('/test/result', { test_id: testId, conclusions });
      setSaved(true);
    } catch (err) {
      notify({
        type: 'error',
        text: err.status === 400 ? 'Проверьте правильность данных' : 'Ошибка при сохранении',
      });
    }
  };

  return (
    <form className="conclusion-form">
      <h2>Результаты:</h2>
      {conclusions.map((res, i) => (
        <div className="conclusion-form__item" key={getKey(res)}>
          <select value={res.min_score} onBlur={e => setScore(i, e.target.value)}>
            <option disabled>Кол-во баллов</option>
            {getOptions().map(val => (
              <option value={val.min_score} key={getKey(val)}>
                {`Не менее  ${val.min_score} из ${max}`}
              </option>
            ))}
          </select>
          <textarea placeholder="Описание"
            value={res.text}
            onChange={e => setText(i, e.target.value)}
          />
          <button className="conclusion-form__close" onClick={() => close(i)}>
            <i>close</i>
          </button>
        </div>
      ))}
      {conclusions.length <= max && (
        <button className="conclusion-form__add" onClick={add}>+</button>
      )}
      <Button className="conclusion-form__save" disabled={saved}>
        {saved ? 'Сохранено' : 'Сохранить'}
      </Button>
    </form>
  );
}

function reducer(questions, action) {
  const update = draft => produce(questions, draft);
  switch (action.type) {
    case 'set':
      return action.value;
    case 'add-question':
      return [...questions, makeQuestion()];
    case 'remove-question':
      return questions.filter((_, i) => i !== action.index);
    case 'set-question-text':
      return update(_questions => {
        _questions[action.index].text = action.text;
      });
    case 'add-answer':
      return update(_questions => {
        _questions[action.questionIndex].answers.push(makeAnswer());
      });
    case 'remove-answer':
      return update(_questions => {
        _questions[action.questionIndex].answers.splice(action.answerIndex, 1);
      });
    case 'set-answer-text':
      return update(_questions => {
        const question = _questions[action.questionIndex];
        question.answers[action.answerIndex].text = action.text;
      });
    case 'check-answer':
      return update(_questions => {
        const question = _questions[action.questionIndex];
        question.answers[action.answerIndex].correct = action.checked;
      });
    default:
      throw new Error(`Unknown action: ${action && action.type}`);
  }
}

export default function TestEdit() {
  const router = useRouter();

  const { category_id, id } = router.query;
  const [name, setName] = useState('');
  const [questions, dispatch] = useReducer(reducer, [makeQuestion()]);
  const [conclusions, setConclusions] = useState([]);

  const [saved, setSaved] = useState(Boolean(id));

  const { notify } = useNotification();

  useEffect(() => {
    if (!id) return;
    get(`/test/tests?id=${id}&include=name,questions(text,answers(text,correct)),conclusions(min_score,text)`)
      .then(([res]) => {
        setName(res.name);
        setConclusions(res.conclusions);
        if (res.questions.length) dispatch({ type: 'set', value: res.questions });
        initialize();
      });
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (category_id && !id) {
        const res = await patch('/test/tests', { category_id, name, questions });
        router.push(`/test_edit?id=${res.id}`);
      } else {
        await patch('/test/tests', { id, name, questions });
      }
      setSaved(true);
    } catch (err) {
      notify({
        type: 'error',
        text: err.status === 400 ? 'Проверьте правильность данных' : 'Ошибка при сохранении',
      });
    }
  };

  return (
    <form className="test-edit" onSubmit={onSubmit}>
      <Input className="page-title test-edit__field" data-type="name"
        required
        placeholder="Название теста"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      {questions.map((question, questionIndex) => (
        <div className="test-edit__question" key={getKey(question)}>
          {questions.length > 1 && (
            <button className="test-edit__question-remove"
              onClick={() => dispatch({ type: 'remove-question', index: questionIndex })}>
              <i>close</i>
            </button>
          )}
          <Input className="test-edit__field"
            data-type="question"
            placeholder="Вопрос"
            required
            value={question.text}
            onChange={e => dispatch({
              type: 'set-question-text',
              index: questionIndex,
              text: e.target.value,
            })}
          />
          {question.answers.map((answer, answerIndex) => (
            <div className="test-edit__question-answer" key={getKey(answer)}>
              <input type="checkbox" checked={answer.correct}
                onChange={e => dispatch({
                  type: 'check-answer',
                  questionIndex,
                  answerIndex,
                  checked: e.target.checked,
                })}
              />
              <Input className="test-edit__field"
                data-type="answer"
                placeholder="Ответ"
                required
                value={answer.text}
                onChange={e => dispatch({
                  type: 'set-answer-text',
                  questionIndex,
                  answerIndex,
                  text: e.target.value,
                })}
              />
              {question.answers.length > 2 && (
                <button className="test-answer-remove"
                  onClick={() => dispatch({ type: 'remove-answer', questionIndex, answerIndex })}>
                  <i>close</i>
                </button>
              )}
            </div>
          ))}
          <Button className="test-edit__question-add"
            onClick={() => dispatch({ type: 'add-answer', questionIndex })}>
            Добавить ответ
          </Button>
        </div>
      ))}
      <Button className="test-edit__add"
        onClick={() => dispatch({ type: 'add-question' })}>
        Добавить вопрос
      </Button>
      <Button className="test-edit__save" disabled={saved}>
        {saved ? 'Сохранено' : 'Сохранить'}
      </Button>
      {id && (
        <ConclusionForm
          testId={id}
          initial={conclusions}
          max={questions.reduce((acc, el) => acc + el.answers.filter(ans => ans.correct).length, 0)}
        />
      )}
    </form>
  );
}
