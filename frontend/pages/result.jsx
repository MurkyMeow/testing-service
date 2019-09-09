import { withRouter } from 'next/router';
import { useRequest, get } from '../api';

function viewSuffix(score) {
  if (score >= 5 && score <= 20) return 'баллов';
  const [last] = score.toString().match(/.$/);
  switch (last) {
    case '1':
      return 'балл';
    case '2':
    case '3':
    case '4':
      return 'балла';
    default:
      return 'баллов';
  }
}

const Result = ({ router }) => {
  const [, result] = useRequest(() => get(`/test/result?test_id=${router.query.test_id}`));
  if (!result) return <div className="page-title">Загрузка...</div>;
  return (
    <div className="result-page">
      <div className="page-title">Ваш результат:</div>
      <div className="result-page__score">
        {result.score} {viewSuffix(result.score)} из {result.maxScore}
      </div>
      <div className="result-page__conclusion">{result.conclusion}</div>
    </div>
  );
};

export default withRouter(Result);
