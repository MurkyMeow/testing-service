import Link from 'next/link';

const Button = ({ className = '', link, onClick, variant, children }) => {
  const button = (
    <button className={`button ${className}`} onClick={onClick} variant={variant}>
      {children}
    </button>
  );
  return link ? <Link href={link}>{button}</Link> : button;
};

export default Button;
