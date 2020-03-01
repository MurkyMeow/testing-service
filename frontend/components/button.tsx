import cx from 'classnames';
import { ReactNode } from 'react';
import Link from 'next/link';

import './button.css';

export const Button = (props: {
  className?: string;
  link?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  children?: ReactNode | ReactNode[];
}) => {
  const button = (
    <button
      className={cx(
        props.className,
        'button',
        `button_${props.variant}`,
        props.disabled && 'button_disabled',
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
  return props.link
    ? <Link href={props.link}>{button}</Link>
    : button;
};
