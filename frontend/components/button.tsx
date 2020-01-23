import { ReactNode } from 'react';
import Link from 'next/link';
import css from './button.css';

export const Button = (props: {
  className?: string;
  link?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  children?: ReactNode | ReactNode[];
}) => {
  const button = (
    <button className={`${css.button} ${props.className}`}
      data-variant={props.variant}
      data-disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
  return props.link
    ? <Link href={props.link}>{button}</Link>
    : button;
};
