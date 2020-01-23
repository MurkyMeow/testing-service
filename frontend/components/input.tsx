import { useState, FocusEvent } from 'react';
import css from './input.css';

export const Input = (props: {
  className?: string;
  initial?: string;
  disabled?: boolean;
  onAlter?: (value: string) => void;
}) => {
  const [value, setValue] = useState(props.initial || '');

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (value === e.target.value) return;
    if (props.onAlter) props.onAlter(e.target.value);
    setValue(e.target.value);
  };

  return (
    <input className={`${css.input} ${props.className || ''}`}
      disabled={props.disabled}
      onBlur={handleBlur}
      defaultValue={value}
    />
  );
};
