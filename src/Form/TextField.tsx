'use client';

import React from 'react';
import { Icon } from '../Icon/Icon';
import './form.css';

export interface SiriusTextFieldProps {
  label?: string;
  details?: string;
  error?: string | boolean;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  type?: string;
  name?: string;
  id?: string;
  autoComplete?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export function SiriusTextField({
  label,
  details,
  error,
  value,
  defaultValue,
  placeholder,
  disabled = false,
  readOnly = false,
  required = false,
  type = 'text',
  name,
  id,
  autoComplete,
  prefix,
  suffix,
  icon,
  className = '',
  onChange,
  onBlur,
  onFocus,
}: SiriusTextFieldProps) {
  const inputId = id || (name ? `field-${name}` : undefined);
  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : 'Erreur de saisie';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value, e);
  };

  return (
    <div className={`sirius-field ${disabled ? 'sirius-field--disabled' : ''} ${className}`}>
      {label && (
        <div className="sirius-field__label-wrap">
          <label htmlFor={inputId} className="sirius-field__label">
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
        {icon && <span className="sirius-input__icon">{icon}</span>}
        {prefix && <span className="sirius-input__prefix">{prefix}</span>}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoComplete={autoComplete}
          className="sirius-input"
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          aria-invalid={isError ? 'true' : undefined}
        />

        {suffix && <span className="sirius-input__suffix">{suffix}</span>}
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
