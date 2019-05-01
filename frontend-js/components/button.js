import { el, html } from '../index.js';

const button = ({ classname = '', link = '#', secondary }) => el(content => html`
  <a class=${`button ${secondary ? 'button-secondary' : ''} ${classname}`}
    href=${link}>
    ${content}
  </a>
`);

export default button;
