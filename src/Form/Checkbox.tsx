'use client';

import React from 'react';
import { Icon } from '../Icon/Icon';
import './form.css';

export interface SiriusCheckboxProps {
  label?: React.ReactNode;
  details?: React.ReactNode;
  checked?: boolean | 'indeterminate';
  disabled?: boolean;
  error?: string | boolean;
  name?: string;
  id?: string;
  className?: string;
  onChange?: (newChecked: boolean, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SiriusCheckbox({
  label,
  details,
  checked = false,
  disabled = false,
  error,
  name,
  id,
  className = '',
  onChange,
}: SiriusCheckboxProps) {
  const isIndeterminate = checked === 'indeterminate';
  const isChecked = checked === true;
  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : 'Ce champ est requis';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange?.(e.target.checked, e);
  };

  return (
    <div className={`sirius-field ${disabled ? 'sirius-field--disabled' : ''} ${className}`}>
      <label
        htmlFor={id}
        className={`sirius-checkbox-wrap ${disabled ? 'sirius-checkbox-wrap--disabled' : ''}`}
      >
        <span
          className={`sirius-checkbox ${isChecked ? 'sirius-checkbox--checked' : ''} ${
            isIndeterminate ? 'sirius-checkbox--indeterminate' : ''
          } ${disabled ? 'sirius-checkbox--disabled' : ''} ${
            isError ? 'sirius-checkbox--error' : ''
          }`}
          aria-hidden="true"
        >
          {isChecked && <Icon name="check" size={12} />}
          {isIndeterminate && <Icon name="minus" size={12} />}
        </span>

        <input
          id={id}
          type="checkbox"
          name={name}
          checked={isChecked}
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

      {isError && (
        <div className="sirius-field__error" role="alert" style={{ marginLeft: '28px' }}>
          <span className="sirius-field__error-icon" aria-hidden="true"><Icon name="alert-circle" size={14} /></span>
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
