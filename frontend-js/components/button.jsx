import Link from 'next/link';

const Button = ({ className = '', link, onClick, secondary, children }) => {
  const button = (
    <button
      className={`button ${secondary ? 'button-secondary' : ''} ${className}`}
      onClick={onClick}>
      {children}
    </button>
  );
  return link ? <Link href={link}>{button}</Link> : button;
};

export default Button;
