'use client';

import { Icon } from '../Icon/Icon';

import React from 'react';
import './form.css';

export interface URLFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  details?: string;
  error?: string | boolean;
  disabled?: boolean;
  prefix?: string;
}

export const URLField: React.FC<URLFieldProps> = ({
  label,
  details,
  error,
  disabled = false,
  prefix = 'https://',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? `sirius-url-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;

  return (
    <div className={`sirius-field ${disabled ? 'sirius-field--disabled' : ''} ${className}`}>
      {label && (
        <div className="sirius-field__label-wrap">
          <label htmlFor={inputId} className="sirius-field__label">
            {label}
          </label>
        </div>
      )}

      <div
        className={`sirius-input-box ${disabled ? 'sirius-input-box--disabled' : ''} ${
          isError ? 'sirius-input-box--error' : ''
        }`}
      >
        {prefix && <span className="sirius-input__prefix">{prefix}</span>}

        <input
          id={inputId}
          type="url"
          disabled={disabled}
          className="sirius-input"
          {...props}
        />
      </div>

      {details && !errorMessage && <p className="sirius-field__details">{details}</p>}

      {errorMessage && (
        <div className="sirius-field__error">
          <span className="sirius-field__error-icon"><Icon name="alert-circle" size={14} /></span>
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
