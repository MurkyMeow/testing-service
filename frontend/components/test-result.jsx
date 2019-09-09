import Link from 'next/link';

function getHref(result) {
  if (result.test) return `/test?id=${result.test.id}`;
  if (result.user) return `/profile?id=${result.user.id}`;
  return '';
}

export const TestResult = ({ result }) => (
  <Link href={getHref(result)}>
    <div className="test-result">
      {result.test
        ? result.test.name
        : result.user.name || `Пользователь №${result.user.id}`
      }
      {result.test
        ? ` (${result.score} из ${result.test.maxScore})`
        : ` — ${result.score}`
      }
      {result.conclusion && <>
        <div className="test-result__conclusion">{result.conclusion}</div>
        <i>info</i>
      </>}
    </div>
  </Link>
);
