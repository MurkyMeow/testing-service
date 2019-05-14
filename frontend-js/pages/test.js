import { el, html, useState } from '../index.js';

const test = el(() => {
  const [slide, setSlide] = useState(0);
  return html`
    <div class="test-page">
      <div class="test-page-frame" onclick=${() => setSlide(slide + 1)}
        style=${`--slide-index: ${slide}`}>
        <div class="test-page-test">Foo</div>
        <div class="test-page-test">Bar</div>
        <div class="test-page-test">Baz</div>
      </div>
    </div>
  `;
});

export default test;
