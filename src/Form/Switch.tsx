'use client';

import React from 'react';
import './form.css';

export interface SiriusSwitchProps {
  label?: React.ReactNode;
  details?: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
  onChange?: (checked: boolean) => void;
}

export function SiriusSwitch({
  label,
  details,
  checked = false,
  disabled = false,
  id,
  name,
  className = '',
  onChange,
}: SiriusSwitchProps) {
  const handleClick = () => {
    if (disabled) return;
    onChange?.(!checked);
  };

  return (
    <div className={`sirius-field ${disabled ? 'sirius-field--disabled' : ''} ${className}`}>
      <label
        htmlFor={id}
        className={`sirius-switch-wrap ${disabled ? 'sirius-switch-wrap--disabled' : ''}`}
        onClick={handleClick}
      >
        <span
          className={`sirius-switch ${checked ? 'sirius-switch--checked' : ''} ${
            disabled ? 'sirius-switch--disabled' : ''
          }`}
          aria-hidden="true"
        >
          <span className="sirius-switch__thumb" />
        </span>

        <input
          id={id}
          type="checkbox"
          name={name}
          checked={checked}
          disabled={disabled}
          readOnly
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
        />

        {(label || details) && (
          <div className="sirius-checkbox__label-block">
            {label && <span className="sirius-checkbox__label">{label}</span>}
            {details && <span className="sirius-checkbox__details">{details}</span>}
          </div>
        )}
      </label>
    </div>
  );
}
