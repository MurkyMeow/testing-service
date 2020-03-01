import cx from 'classnames';
import { InputHTMLAttributes } from 'react';
import './input.css';

export function Input(props: {
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx('input', props.className)}
      placeholder={props.placeholder}
      disabled={props.disabled}
    />
  );
}
