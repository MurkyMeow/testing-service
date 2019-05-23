import { useState, useRef, useEffect } from 'react';
import { withRouter } from 'next/router';
import produce from 'immer';
import { get, patch } from '../api';
import { getKey, withKey } from '../index';
import { Editable } from '../components/editable';
import Button from '../components/button';

const makeAnswer = () => withKey({
  text: '',
  correct: 0,
});
const makeQuestion = () => withKey({
  text: '',
  answers: [makeAnswer(), makeAnswer()],
});

const prevented = func => e => {
  e.preventDefault();
  if (func) func();
};

const TestEdit = ({ router }) => {
  const { category_id, id } = router.query;
  const form = useRef();
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(Boolean(id));
  const [questions, setQuestions] = useState([makeQuestion()]);

  const update = draft => {
    setQuestions(produce(questions, draft));
    setSaved(false);
  };
  const changeName = e => {
    setName(e.target.value);
    setSaved(false);
  };

  useEffect(() => {
    if (!id) return;
    get(`/test/tests?id=${id}&include=name,questions(text,answers(text,correct))`)
      .then(([res]) => {
        setName(res.name);
        if (res.questions.length) setQuestions(res.questions);
      })
      .catch(console.error);
  }, []);

  const addQuestion = () => {
    update(_questions => {
      _questions.push(makeQuestion());
    });
  };
  const removeQuestion = index => {
    update(_questions => {
      _questions.splice(index, 1);
    });
  };
  const setQuestionText = (index, text) => {
    update(_questions => {
      const question = _questions[index];
      question.text = text;
    });
  };

  const addAnswer = questionIndex => {
    update(_questions => {
      _questions[questionIndex].answers.push(makeAnswer());
    });
  };
  const removeAnswer = (questionIndex, answerIndex) => {
    update(_questions => {
      _questions[questionIndex].answers.splice(answerIndex, 1);
    });
  };
  const setAnswerText = (questionIndex, answerIndex, text) => {
    update(_questions => {
      const { answers } = _questions[questionIndex];
      answers[answerIndex].text = text;
    });
  };
  const checkAnswer = (questionIndex, answerIndex, checked) => {
    update(_questions => {
      const answer = _questions[questionIndex].answers[answerIndex];
      answer.correct = checked;
    });
  };
  const submit = async e => {
    e.preventDefault();
    if (!form.current.reportValidity()) return;
    if (category_id && !id) {
      const res = await patch('/test/tests', { category_id, name, questions });
      router.push(`/test_edit?id=${res.id}`);
    } else {
      await patch('/test/tests', { id, name, questions });
    }
    setSaved(true);
  };
  return (
    <form className="test-add-page" onSubmit={submit} ref={form}>
      <Editable className="page-title --name" required
        placeholder="Название теста"
        value={name}
        onChange={changeName}
      />
      {questions.map((question, questionIndex) => (
        <div className="test-add-page__question" key={getKey(question)}>
          {questions.length > 1 && (
            <i className="test-add-page__remove-btn"
              onClick={() => removeQuestion(questionIndex)}>
              close
            </i>
          )}
          <Editable className="--question" placeholder="Вопрос" required
            value={question.text}
            onChange={e => setQuestionText(questionIndex, e.target.value)}
          />
          {question.answers.map((answer, answerIndex) => (
            <div className="test-add-page__question__answer" key={getKey(answer)}>
              <input type="checkbox" checked={answer.correct}
                onChange={e => checkAnswer(questionIndex, answerIndex, e.target.checked)}
              />
              <Editable className="--answer" placeholder="Ответ" required
                value={answer.text}
                onChange={e => setAnswerText(questionIndex, answerIndex, e.target.value)}
              />
              {question.answers.length > 2 && (
                <i className="test-add-page__remove-btn"
                  onClick={() => removeAnswer(questionIndex, answerIndex)}>
                  close
                </i>
              )}
            </div>
          ))}
          <Button className="test-add-page__question__add-btn"
            onClick={prevented(() => addAnswer(questionIndex))}>
            Добавить ответ
          </Button>
        </div>
      ))}
      <Button className="test-add-page__add-btn"
        onClick={prevented(addQuestion)}>
        Добавить вопрос
      </Button>
      {saved ? (
        <Button className="test-add-page__send-btn" variant="disabled"
          onClick={prevented()}>
          Сохранено
        </Button>
      ) : (
        <Button className="test-add-page__send-btn">Сохранить</Button>
      )}
    </form>
  );
};

export default withRouter(TestEdit);
