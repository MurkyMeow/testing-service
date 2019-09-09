import { useState } from 'react';

export const Editable = ({ className = '', initial, onAlter, ...props }) => {
  const [value, setValue] = useState(initial);
  const onBlur = e => {
    if (value === e.target.value) return;
    if (onAlter) onAlter(e.target.value);
    setValue(e.target.value);
  };
  return (
    <input className={`editable ${className}`} {...props}
      onBlur={onBlur}
      defaultValue={value}/>
  );
};
