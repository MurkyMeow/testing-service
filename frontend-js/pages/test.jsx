import { useState } from 'react';

const Test = () => {
  const [slide, setSlide] = useState(0);
  return (
    <div className="test-page">
      <div className="test-page-frame" onClick={() => setSlide(slide + 1)}
        style={`--slide-index: ${slide}`}>
        <div className="test-page-test">Foo</div>
        <div className="test-page-test">Bar</div>
        <div className="test-page-test">Baz</div>
      </div>
    </div>
  );
};

export default Test;
