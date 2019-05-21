import { withRouter } from 'next/router';
import { useRequest, get } from '../api';

const Result = ({ router }) => {
  const [, result] = useRequest(() => get(`/test/result?test_id=${router.query.test_id}`));
  if (!result) return <div className="page-title">Загрузка...</div>;
  return (
    <div className="result-page">
      <div className="page-title">Ваш результат:</div>
      <div className="result-page__result">{result.score * 100}%</div>
      <div className="result-page__conclusion">{result.conclusion}</div>
    </div>
  );
};

export default withRouter(Result);
