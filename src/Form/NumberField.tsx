'use client';

import React from 'react';
import { Icon } from '../Icon/Icon';
import './form.css';

export interface SiriusNumberFieldProps {
  label?: string;
  details?: string;
  value?: number | string;
  defaultValue?: number | string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string | boolean;
  step?: number;
  min?: number;
  max?: number;
  name?: string;
  id?: string;
  className?: string;
  onChange?: (value: number, e?: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SiriusNumberField({
  label,
  details,
  value,
  defaultValue,
  placeholder,
  disabled = false,
  required = false,
  error,
  step = 1,
  min,
  max,
  name,
  id,
  className = '',
  onChange,
}: SiriusNumberFieldProps) {
  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : 'Valeur numérique invalide';

  const currentVal = value !== undefined ? Number(value) : defaultValue !== undefined ? Number(defaultValue) : 0;

  const handleStep = (delta: number) => {
    if (disabled) return;
    let nextVal = (isNaN(currentVal) ? 0 : currentVal) + delta;
    if (min !== undefined && nextVal < min) nextVal = min;
    if (max !== undefined && nextVal > max) nextVal = max;
    onChange?.(nextVal);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      onChange?.(0, e);
      return;
    }
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      onChange?.(parsed, e);
    }
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
        className={`sirius-input-box ${disabled ? 'sirius-input-box--disabled' : ''} ${
          isError ? 'sirius-input-box--error' : ''
        }`}
      >
        <input
          id={id}
          name={name}
          type="number"
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          step={step}
          min={min}
          max={max}
          className="sirius-input"
          onChange={handleChange}
          style={{ MozAppearance: 'textfield' }}
        />

        <div className="sirius-stepper">
          <button
            type="button"
            className="sirius-stepper__btn"
            onClick={() => handleStep(step)}
            disabled={disabled}
            aria-label="Incrémenter"
          >
            <Icon name="chevron-up" size={10} />
          </button>
          <button
            type="button"
            className="sirius-stepper__btn"
            onClick={() => handleStep(-step)}
            disabled={disabled}
            aria-label="Décrémenter"
          >
            <Icon name="chevron-down" size={10} />
          </button>
        </div>
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
