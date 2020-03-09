import { useState, useEffect, FormEvent } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import { useRouter } from 'next/router';
import { getKey, withKey } from '../index';
import { Input } from '../components/input';
import { Button } from '../components/button';
import { useNotification } from '../components/notification';
import { useGetFullTestLazyQuery, useEditTestMutation, useCreateTestMutation, useSetTestConclusionsMutation } from '../graphql-types';
import './test_edit.css';

interface Conclusion {
  id?: number;
  text: string;
  minScore: number;
}

interface Answer {
  id?: number;
  text: string;
  correct: boolean;
}

interface Question {
  id?: number;
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

  const getOptions = () =>
    [...Array(props.max + 1).keys()].map(makeConclusion);

  const onSubmit = async (data: { conclusions: Conclusion[] }) => {
    try { 
      await setConclusion({
        variables: { testId: props.testId, conclusions: data.conclusions },
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
    <Formik className="conclusion-form" initialValues={{ conclusions }} onSubmit={onSubmit}>
      <Form>
        <h2>Результаты:</h2>
        <FieldArray name="conclusions">
          {conclusionFields => (
            <div>
              {conclusions.map((conclusion, i) => (
                <div className="conclusion-form__item" key={getKey(conclusion)}>
                  <Field name={`conclusions.${i}.minScore`} as="select">
                    <option disabled>Кол-во баллов</option>
                    {getOptions().map(val => (
                      <option value={val.minScore} key={getKey(val)}>
                        {`Не менее  ${val.minScore} из ${props.max}`}
                      </option>
                    ))}
                  </Field>
                  <Field name={`conclusions.${i}.text`} placeholder="Описание" />
                  <button className="conclusion-form__close" type="button"
                    onClick={() => conclusionFields.remove(i)}>
                    <i>close</i>
                  </button>
                </div>
              ))}
              {conclusions.length <= props.max && (
                <button className="conclusion-form__add" type="button"
                  onClick={() => conclusionFields.push('')}>
                  +
                </button>
              )}
              <Button className="conclusion-form__save" disabled={saved}>
                {saved ? 'Сохранено' : 'Сохранить'}
              </Button>
            </div>
          )}
        </FieldArray>
      </Form>
    </Formik>
  );
}

function Answer(props: { answer: Answer; prefix: string; onRemove?: () => void }) {
  return (
    <div>
      <Field name={`${props.prefix}.text`} />
      <Field name={`${props.prefix}.correct`} />
      <button className="test-answer-remove" onClick={props.onRemove}>
        <i>close</i>
      </button>
    </div>
  );
}

function Question(props: { question: Question; prefix: string; onRemove?: () => void }) {
  return (
    <div className="test-edit__question">
      <button className="test-edit__question-remove" onClick={props.onRemove}>
        <i>close</i>
      </button>
      <Field name={`${props.prefix}.text`} />
      <FieldArray name="answers">
        {answersForm => (
          <div className="group">
            {props.question.answers.map((answer, i) => (
              <Answer answer={answer} prefix={`${props.prefix}.answers.${i}`} key={i} />
            ))}
            <Button className="test-edit__question-add" onClick={() => answersForm.push('')}>
              Добавить ответ
            </Button>
          </div>
        )}
      </FieldArray>
    </div>
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
      <Formik initialValues={{ questions }} onSubmit={() => setQuestions(questions)}>
        {questionsForm => (
          <FieldArray name="questions">
            {questionFields => (
              <div>
                {questionsForm.values.questions.map((question, i) => (
                  <Question key={i}
                    question={question}
                    prefix={`questions.${i}`}
                    onRemove={() => questionFields.remove(i)}
                  />
                ))}
                <Button className="test-edit__add" onClick={() => questionFields.push('')}>
                  Добавить вопрос
                </Button>
              </div>
            )}
          </FieldArray>
        )}
      </Formik>
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
