import cx from 'classnames';
import { ReactNode } from 'react';
import Link from 'next/link';

import './button.css';

export function Button(props: {
  className?: string;
  link?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  children?: ReactNode | ReactNode[];
}) {
  const inner = (
    <span className={cx(
      props.className,
      'button',
      `button_${props.variant}`,
      props.disabled && 'button_disabled',
    )}>
      {props.children}
    </span>
  );
  if (props.link === undefined) {
    return <button className="button-wrap">{inner}</button>;
  }
  return (
    <Link href={props.link}>
      <a className="button-wrap">{inner}</a>
    </Link>
  );
}
