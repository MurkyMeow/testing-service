import { useState, useLayoutEffect, useRef, useReducer, useEffect } from 'react';
import { withRouter } from 'next/router';
import produce from 'immer';
import { get, patch } from '../api';
import { getKey, withKey, notify } from '../index';
import { Editable } from '../components/editable';
import Button from '../components/button';
import css from './test_edit.css';

const showError = err => {
  const message = err.status === 400
    ? 'Проверьте правильность данных'
    : 'Ошибка при сохранении';
  notify('error', message);
};

const makeAnswer = () => withKey({
  text: '',
  correct: false,
});
const makeQuestion = () => withKey({
  text: '',
  answers: [makeAnswer(), makeAnswer()],
});
const makeConclusion = (min_score = 0) => withKey({ text: '', min_score });

function useSave(isSaved, autoInit, reactTo) {
  const [saved, setSaved] = useState(isSaved);
  const [initialized, setInitialized] = useState(false);

  useLayoutEffect(() => {
    if (autoInit) setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) setSaved(false);
  }, reactTo);

  const saveButton = ({ className, onClick }) => (
    <Button className={className} onClick={saved ? null : onClick}
      variant={saved ? 'disabled' : ''}>
      {saved ? 'Сохранено' : 'Сохранить'}
    </Button>
  );

  return {
    saved,
    setSaved,
    saveButton,
    initialize: () => setInitialized(true),
  };
}

const ConclusionForm = ({ testId, initial, max }) => {
  const [conclusions, setConclusions] = useState(initial);
  const { saveButton, setSaved } = useSave(true, true, [conclusions]);
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
      showError(err);
    }
  };
  return <>
    <h2>Результаты:</h2>
    <div className={css.conclusionForm}>
      {conclusions.map((res, i) => (
        <div className={css.conclusion} key={getKey(res)}>
          <select value={res.min_score} onChange={e => setScore(i, e.target.value)}>
            <option disabled>Кол-во баллов</option>
            {getOptions().map(val => (
              <option key={getKey(val)} value={val.min_score}>
                Не менее  {val.min_score} из {max}
              </option>
            ))}
          </select>
          <textarea placeholder="Описание" value={res.text}
            onChange={e => setText(i, e.target.value)}
          />
          <i className={css.conclusion-Close} onClick={() => close(i)}>close</i>
        </div>
      ))}
    </div>
    {conclusions.length <= max && (
      <div className={css.conclusionAdd} onClick={add}>+</div>
    )}
    {saveButton({ className: css.sendBtn, onClick: save })}
  </>;
};

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

const TestEdit = ({ router }) => {
  const { category_id, id } = router.query;
  const form = useRef();
  const [name, setName] = useState('');
  const [questions, dispatch] = useReducer(reducer, [makeQuestion()]);
  const [conclusions, setConclusions] = useState([]);
  const {
    setSaved,
    initialize,
    saveButton,
  } = useSave(Boolean(id), false, [name, questions]);

  useEffect(() => {
    if (!id) return;
    get(`/test/tests?id=${id}&include=name,questions(text,answers(text,correct)),conclusions(min_score,text)`)
      .then(([res]) => {
        setName(res.name);
        setConclusions(res.conclusions);
        if (res.questions.length) dispatch({ type: 'set', value: res.questions });
        initialize();
      })
      .catch(console.error);
  }, []);

  const submit = async () => {
    if (!form.current.reportValidity()) return;
    try {
      if (category_id && !id) {
        const res = await patch('/test/tests', { category_id, name, questions });
        router.push(`/test_edit?id=${res.id}`);
      } else {
        await patch('/test/tests', { id, name, questions });
      }
      setSaved(true);
    } catch (err) {
      showError(err);
    }
  };
  return (
    <form className={css.pageAddTest} onSubmit={e => e.preventDefault()} ref={form}>
      <Editable className={`page-title ${css.field}`} data-type="name"
      required
        placeholder="Название теста"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      {questions.map((question, questionIndex) => (
        <div className={css.question} key={getKey(question)}>
          {questions.length > 1 && (
            <i className={css.removeBtn}
              onClick={() => dispatch({ type: 'remove-question', index: questionIndex })}>
              close
            </i>
          )}
          <Editable className={css.field} data-type="question" placeholder="Вопрос" required
            value={question.text}
            onChange={e => dispatch({
              type: 'set-question-text',
              index: questionIndex,
              text: e.target.value,
            })}
          />
          {question.answers.map((answer, answerIndex) => (
            <div className={css.question__answer} key={getKey(answer)}>
              <input type="checkbox" checked={answer.correct}
                onChange={e => dispatch({
                  type: 'check-answer',
                  questionIndex,
                  answerIndex,
                  checked: e.target.checked,
                })}
              />
              <Editable className={css.field} data-type="answer" placeholder="Ответ" required
                value={answer.text}
                onChange={e => dispatch({
                  type: 'set-answer-text',
                  questionIndex,
                  answerIndex,
                  text: e.target.value,
                })}
              />
              {question.answers.length > 2 && (
                <i className={css.removeBtn}
                  onClick={() => dispatch({ type: 'remove-answer', questionIndex, answerIndex })}>
                  close
                </i>
              )}
            </div>
          ))}
          <Button className={css.question__addBtn}
            onClick={() => dispatch({ type: 'add-answer', questionIndex })}>
            Добавить ответ
          </Button>
        </div>
      ))}
      <Button className={css.addBtn}
        onClick={() => dispatch({ type: 'add-question' })}>
        Добавить вопрос
      </Button>
      {saveButton({ className: css.sendBtn, onClick: submit })}
      {id && (
        <ConclusionForm
          testId={id}
          initial={conclusions}
          max={questions.reduce((acc, el) => acc + el.answers.filter(ans => ans.correct).length, 0)}
        />
      )}
    </form>
  );
};

export default withRouter(TestEdit);
