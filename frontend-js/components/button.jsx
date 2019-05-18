import Link from 'next/link';

const Button = ({ className = '', link = '', onClick, secondary, children }) => (
  <Link href={link}>
    <button
      className={`button ${secondary ? 'button-secondary' : ''} ${className}`}
      onClick={onClick}>
      {children}
    </button>
  </Link>
);

export default Button;
