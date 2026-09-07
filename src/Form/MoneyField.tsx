'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '../Icon/Icon';
import './form.css';

export interface SiriusMoneyFieldProps {
  label?: string;
  details?: string;
  value?: number;
  defaultValue?: number;
  currency?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string | boolean;
  name?: string;
  id?: string;
  className?: string;
  onChange?: (value: number) => void;
}

// Formatage FCFA : entiers stricts avec espace séparateur de milliers (ex: 150 000)
function formatCFA(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return '';
  return Math.round(val)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function SiriusMoneyField({
  label,
  details,
  value,
  defaultValue,
  currency = 'FCFA',
  placeholder = 'Ex: 25 000',
  disabled = false,
  required = false,
  error,
  name,
  id,
  className = '',
  onChange,
}: SiriusMoneyFieldProps) {
  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : 'Montant invalide';

  // Valeur affichée formatée en chaîne
  const initialNum = value !== undefined ? value : defaultValue !== undefined ? defaultValue : undefined;
  const [displayValue, setDisplayValue] = useState<string>(
    initialNum !== undefined ? formatCFA(initialNum) : ''
  );

  useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(formatCFA(value));
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Supprime tout ce qui n'est pas un chiffre (pas de virgule, pas de point)
    const rawNumbers = e.target.value.replace(/\D/g, '');
    if (!rawNumbers) {
      setDisplayValue('');
      onChange?.(0);
      return;
    }

    const num = parseInt(rawNumbers, 10);
    setDisplayValue(formatCFA(num));
    onChange?.(num);
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
          type="text"
          inputMode="numeric"
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="sirius-input"
          onChange={handleInputChange}
          style={{ fontWeight: 600 }}
        />

        {currency && (
          <span className="sirius-input__suffix" style={{ fontWeight: 650, color: '#202223' }}>
            {currency}
          </span>
        )}
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
