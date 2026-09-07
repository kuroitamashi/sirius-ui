'use client';

import { Icon } from '../Icon/Icon';

import React, { useRef } from 'react';
import './form.css';

export interface ColorFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  details?: string;
  error?: string | boolean;
  disabled?: boolean;
}

export const ColorField: React.FC<ColorFieldProps> = ({
  label,
  details,
  error,
  disabled = false,
  value = '#202020',
  onChange,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? `sirius-color-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;
  const colorPickerRef = useRef<HTMLInputElement>(null);

  const hexValue = String(value).startsWith('#') ? String(value) : `#${value}`;

  const handleSwatchClick = () => {
    if (!disabled && colorPickerRef.current) {
      colorPickerRef.current.click();
    }
  };

  const handleNativeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
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
        {/* Swatch preview */}
        <div
          onClick={handleSwatchClick}
          className="sirius-color-swatch"
          style={{ backgroundColor: hexValue, cursor: disabled ? 'not-allowed' : 'pointer' }}
          title="Sélectionner une couleur"
        />

        {/* Hidden native color input for browser picker */}
        <input
          ref={colorPickerRef}
          type="color"
          disabled={disabled}
          value={hexValue.slice(0, 7)}
          onChange={handleNativeColorChange}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
          aria-hidden="true"
        />

        <input
          id={inputId}
          type="text"
          disabled={disabled}
          value={value}
          onChange={onChange}
          className="sirius-input"
          placeholder="#000000"
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
