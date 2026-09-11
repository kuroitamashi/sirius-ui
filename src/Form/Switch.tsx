'use client';

import React, { useId } from 'react';
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
  'aria-label'?: string;
}

export function SiriusSwitch({
  label,
  details,
  checked = false,
  disabled = false,
  id: idProp,
  name,
  className = '',
  onChange,
  'aria-label': ariaLabel,
}: SiriusSwitchProps) {
  const generatedId = useId();
  const id = idProp || generatedId;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange?.(e.target.checked);
  };

  return (
    <div className={`sirius-switch-field ${disabled ? 'sirius-switch-field--disabled' : ''} ${className}`}>
      <label
        htmlFor={id}
        className={`sirius-switch-wrap ${disabled ? 'sirius-switch-wrap--disabled' : ''}`}
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
          role="switch"
          name={name}
          checked={checked}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-checked={checked}
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
    </div>
  );
}
