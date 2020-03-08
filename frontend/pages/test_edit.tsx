import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { getKey, withKey } from '../index';
import { Input } from '../components/input';
import { Button } from '../components/button';
import { useNotification } from '../components/notification';
import { useGetFullTestLazyQuery, useEditTestMutation, useCreateTestMutation, useSetTestConclusionsMutation } from '../graphql-types';
import './test_edit.css';

interface Conclusion {
  id: number;
  text: string;
  minScore: number;
}

interface Answer {
  id: number;
  text: string;
  correct: boolean;
}

interface Question {
  id: number;
  text: string;
  answers: Answer[];
}

const makeAnswer = () => withKey({
  text: '',
  correct: false,
});
const makeQuestion = () => withKey({
  text: '',
  answers: [makeAnswer(), makeAnswer()],
});
const makeConclusion = (min_score = 0) => withKey({ text: '', min_score });

function ConclusionForm(props: { testId: number; initial: Conclusion[]; max: number }) {
  const [conclusions, setConclusions] = useState(props.initial);
  const [saved, setSaved] = useState(true);

  const { notify } = useNotification();

  const [setConclusion] = useSetTestConclusionsMutation();

  useEffect(() => {
    setConclusions(props.initial);
  }, [props.initial]);

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
    [...Array(props.max + 1).keys()].map(makeConclusion);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try { 
      await setConclusion({
        variables: { testId: props.testId, conclusions },
      });
      setSaved(true);
    } catch (err) {
      notify({
        type: 'error',
        text: err.status === 400 ? 'Проверьте правильность данных' : 'Ошибка при сохранении',
      });
    }
  };

  return (
    <form className="conclusion-form" onSubmit={onSubmit}>
      <h2>Результаты:</h2>
      {conclusions.map((conclusion, i) => (
        <div className="conclusion-form__item" key={getKey(conclusion)}>
          <select value={conclusion.minScore} onBlur={e => setScore(i, e.target.value)}>
            <option disabled>Кол-во баллов</option>
            {getOptions().map(val => (
              <option value={val.minScore} key={getKey(val)}>
                {`Не менее  ${val.minScore} из ${props.max}`}
              </option>
            ))}
          </select>
          <textarea placeholder="Описание"
            value={conclusion.text}
            onChange={e => setText(i, e.target.value)}
          />
          <button className="conclusion-form__close" type="button"
            onClick={() => close(i)}>
            <i>close</i>
          </button>
        </div>
      ))}
      {conclusions.length <= props.max && (
        <button className="conclusion-form__add" type="button" onClick={add}>
          +
        </button>
      )}
      <Button className="conclusion-form__save" disabled={saved}>
        {saved ? 'Сохранено' : 'Сохранить'}
      </Button>
    </form>
  );
}

export default function TestEdit() {
  const router = useRouter();

  const { category_id, id } = router.query;
  const [name, setName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([makeQuestion()]);
  const [conclusions, setConclusions] = useState<Conclusion[]>([]);

  const [saved, setSaved] = useState(Boolean(id));

  const { notify } = useNotification();

  const [getFullTest, fullTest] = useGetFullTestLazyQuery();
  const [createTest] = useCreateTestMutation();
  const [editTest] = useEditTestMutation();

  useEffect(() => {
    if (id) getFullTest({ variables: { id: Number(id) } });
  }, [id, getFullTest]);

  useEffect(() => {
    if (!fullTest.data) return;
    const { name, conclusions, questions } = fullTest.data.getTest;
    setName(name);
    setConclusions(conclusions);
    setQuestions(questions);
  }, [fullTest.data]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (category_id && !id) {
        const { data } = await createTest({
          variables: { categoryId: Number(category_id), name, questions },
        });
        if (data) router.push(`/test_edit?id=${data?.createTest.id}`);
      } else {
        await editTest({
          variables: { id: Number(id), name, questions },
        });
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
        onClick={() => setQuestions([...questions, makeQuestion()])}>
        Добавить вопрос
      </Button>
      <Button className="test-edit__save" disabled={saved}>
        {saved ? 'Сохранено' : 'Сохранить'}
      </Button>
      {id && (
        <ConclusionForm testId={Number(id)} initial={conclusions}
          // TODO optimize
          max={questions.reduce((acc, el) => acc + el.answers.filter(ans => ans.correct).length, 0)}
        />
      )}
    </form>
  );
}
