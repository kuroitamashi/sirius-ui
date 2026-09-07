'use client';

import { Icon } from '../Icon/Icon';

import React from 'react';
import './form.css';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  details?: string;
  error?: string | boolean;
  disabled?: boolean;
  maxCharacters?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  details,
  error,
  disabled = false,
  maxCharacters,
  className = '',
  id,
  value,
  rows = 4,
  ...props
}) => {
  const inputId = id || (label ? `sirius-textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;

  const currentLength = value !== undefined ? String(value).length : 0;

  return (
    <div className={`sirius-field ${disabled ? 'sirius-field--disabled' : ''} ${className}`}>
      {label && (
        <div className="sirius-field__label-wrap">
          <label htmlFor={inputId} className="sirius-field__label">
            {label}
          </label>
          {maxCharacters && (
            <span style={{ fontSize: '12px', color: '#6d7175' }}>
              {currentLength}/{maxCharacters}
            </span>
          )}
        </div>
      )}

      <div
        className={`sirius-input-box ${disabled ? 'sirius-input-box--disabled' : ''} ${
          isError ? 'sirius-input-box--error' : ''
        }`}
        style={{ minHeight: 'auto', alignItems: 'stretch' }}
      >
        <textarea
          id={inputId}
          disabled={disabled}
          value={value}
          rows={rows}
          maxLength={maxCharacters}
          className="sirius-input"
          style={{ resize: 'vertical', minHeight: '80px', padding: '8px 12px' }}
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
