export const TestResult = ({ result }) => (
  <div className="test-result">
    {result.test
      ? result.test.name
      : result.user.name
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
);
