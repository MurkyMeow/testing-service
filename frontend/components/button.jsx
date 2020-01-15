import Link from 'next/link';
import css from './button.css';

const Button = ({ className = '', link, onClick, variant, children }) => {
  const button = (
    <button className={`${css.button} ${className}`} data-variant={variant} onClick={onClick}>
      {children}
    </button>
  );
  return link ? <Link href={link}>{button}</Link> : button;
};

export default Button;
