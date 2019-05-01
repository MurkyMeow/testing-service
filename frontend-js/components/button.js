import { el, html } from '../index.js';

const button = ({ classname = '', link = '#', click, secondary }) => el(content => html`
  <a class=${`button ${secondary ? 'button-secondary' : ''} ${classname}`}
    href=${link}
    onclick=${click}>
    ${content}
  </a>
`);

export default button;
