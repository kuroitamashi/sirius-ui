'use client';

import React from 'react';
import { Icon } from '../Icon/Icon';
import './form.css';

export interface SiriusSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SiriusSelectProps {
  label?: string;
  details?: string;
  options: (string | SiriusSelectOption)[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string | boolean;
  id?: string;
  name?: string;
  className?: string;
  onChange?: (value: string, e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function SiriusSelect({
  label,
  details,
  options,
  value,
  defaultValue,
  placeholder,
  disabled = false,
  required = false,
  error,
  id,
  name,
  className = '',
  onChange,
}: SiriusSelectProps) {
  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : 'Veuillez sélectionner une option';

  const normalizedOptions: SiriusSelectOption[] = options.map(opt =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value, e);
  };

  return (
    <div className={`sirius-field ${disabled ? 'sirius-field--disabled' : ''} ${className}`}>
      {label && (
        <div className="sirius-field__label-wrap">
          <label htmlFor={id} className="sirius-field__label">
            {label}
            {required && <span style={{ color: '#c01025', marginLeft: '3px' }}>*</span>}
          </label>
        </div>
      )}

      <div
        className={`sirius-select-wrap ${
          isError ? 'sirius-input-box--error' : ''
        }`}
      >
        <select
          id={id}
          name={name}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          required={required}
          className={`sirius-select ${isError ? 'sirius-input-box--error' : ''}`}
          onChange={handleChange}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {normalizedOptions.map(opt => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        <span className="sirius-select-chevron" aria-hidden="true"><Icon name="select" size={16} /></span>
      </div>

      {details && !isError && <div className="sirius-field__details">{details}</div>}

      {isError && (
        <div className="sirius-field__error" role="alert">
          <span className="sirius-field__error-icon" aria-hidden="true"><Icon name="alert-circle" size={14} /></span>
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
