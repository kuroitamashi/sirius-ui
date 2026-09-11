'use client';

import React from 'react';
import './form.css';

export interface SiriusRadioProps {
  label?: React.ReactNode;
  details?: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string;
  id?: string;
  className?: string;
  onChange?: (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SiriusRadio({
  label,
  details,
  checked = false,
  disabled = false,
  name,
  value,
  id,
  className = '',
  onChange,
}: SiriusRadioProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange?.(e.target.checked, e);
  };

  return (
    <label
      htmlFor={id}
      className={`sirius-radio-wrap ${disabled ? 'sirius-radio-wrap--disabled' : ''} ${className}`}
    >
      <span
        className={`sirius-radio ${checked ? 'sirius-radio--checked' : ''} ${
          disabled ? 'sirius-radio--disabled' : ''
        }`}
        aria-hidden="true"
      />
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
      />
      {(label || details) && (
        <div className="sirius-checkbox__label-block">
          {label && <span className="sirius-checkbox__label">{label}</span>}
          {details && <span className="sirius-checkbox__details">{details}</span>}
        </div>
      )}
    </label>
  );
}

export default SiriusRadio;
