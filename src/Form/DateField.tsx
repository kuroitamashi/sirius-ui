'use client';

import { Icon } from '../Icon/Icon';

import React, { useRef } from 'react';
import './form.css';

export interface DateFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  details?: string;
  error?: string | boolean;
  disabled?: boolean;
}

export const DateField: React.FC<DateFieldProps> = ({
  label,
  details,
  error,
  disabled = false,
  className = '',
  id,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = id || (label ? `sirius-date-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;

  const handleIconClick = () => {
    if (!disabled && inputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        try {
          (inputRef.current as any).showPicker();
        } catch {
          inputRef.current.focus();
        }
      } else {
        inputRef.current.focus();
      }
    }
  };

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
        <input
          ref={inputRef}
          id={inputId}
          type="date"
          disabled={disabled}
          className="sirius-input"
          {...props}
        />

        <button
          type="button"
          tabIndex={-1}
          onClick={handleIconClick}
          className="sirius-password-toggle"
          aria-label="Ouvrir le calendrier"
          disabled={disabled}
        >
          <Icon name="calendar" size={16} />
        </button>
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
