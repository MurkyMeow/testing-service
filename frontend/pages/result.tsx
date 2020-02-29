import { useRouter } from 'next/router';
import { useGetResultQuery } from '../graphql-types';
import './result.css';

function viewSuffix(score: number): string {
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

export default function Result() {
  const router = useRouter();

  const getResultQuery = useGetResultQuery({
    variables: { testId: Number(router.query.testId) },
  });

  const result = getResultQuery.data?.getResult;

  if (!result) return <div className="page-title">Загрузка...</div>;
  return (
    <div className="page-result">
      <div className="page-title">Ваш результат:</div>
      <div className="page-result__score">
        {result.score} {viewSuffix(result.score)} из {result.test.maxScore}
      </div>
      <div className="page-result__conclusion">{result.conclusion}</div>
    </div>
  );
}
