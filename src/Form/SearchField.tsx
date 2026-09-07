'use client';

import { Icon } from '../Icon/Icon';

import React from 'react';
import './form.css';

export interface SearchFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  details?: string;
  error?: string | boolean;
  disabled?: boolean;
  onClear?: () => void;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  label,
  details,
  error,
  disabled = false,
  className = '',
  id,
  value,
  onChange,
  onClear,
  placeholder = 'Rechercher...',
  ...props
}) => {
  const inputId = id || (label ? `sirius-search-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;
  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      const event = {
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
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
        <div className="sirius-input__icon"><Icon name="search" size={15} /></div>

        <input
          id={inputId}
          type="search"
          disabled={disabled}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="sirius-input"
          {...props}
        />

        {hasValue && !disabled && (
          <button
            type="button"
            tabIndex={-1}
            onClick={handleClear}
            className="sirius-password-toggle"
            aria-label="Effacer la recherche"
            style={{ padding: '0 8px' }}
          >
            <Icon name="x" size={14} />
          </button>
        )}
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
