export const TestResult = ({ result }) => (
  <div className="test-result">
    {result.test.name} ({result.score} из {result.maxScore})
    {result.conclusion && <>
      <div className="test-result__conclusion">{result.conclusion}</div>
      <i>info</i>
    </>}
  </div>
);
