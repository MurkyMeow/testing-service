import cx from 'classnames';
import { ReactNode } from 'react';

import './button.css';

export function Button(props: {
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  children?: ReactNode | ReactNode[];
}) {
  return (
    <button className={cx(
      'button',
      `button__${props.variant}`,
      props.disabled && 'button__disabled',
      props.className,
    )}>
      {props.children}
    </button>
  );
}
