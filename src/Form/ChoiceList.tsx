'use client';

import React from 'react';
import { Icon } from '../Icon/Icon';
import { SiriusCheckbox } from './Checkbox';
import './form.css';

export interface SiriusChoiceOption {
  value: string;
  label: React.ReactNode;
  details?: React.ReactNode;
  disabled?: boolean;
}

export interface SiriusChoiceListProps {
  title?: string;
  choices: SiriusChoiceOption[];
  selected: string[];
  allowMultiple?: boolean;
  name?: string;
  disabled?: boolean;
  error?: string | boolean;
  className?: string;
  onChange?: (selected: string[]) => void;
}

export function SiriusChoiceList({
  title,
  choices,
  selected,
  allowMultiple = false,
  name = 'sirius-choice',
  disabled = false,
  error,
  className = '',
  onChange,
}: SiriusChoiceListProps) {
  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : 'Veuillez faire un choix';

  const handleRadioChange = (val: string) => {
    if (disabled) return;
    onChange?.([val]);
  };

  const handleCheckboxChange = (val: string, checked: boolean) => {
    if (disabled) return;
    if (checked) {
      onChange?.([...selected, val]);
    } else {
      onChange?.(selected.filter(item => item !== val));
    }
  };

  return (
    <div className={`sirius-field ${disabled ? 'sirius-field--disabled' : ''} ${className}`}>
      {title && (
        <div className="sirius-field__label-wrap" style={{ marginBottom: '6px' }}>
          <span className="sirius-field__label">{title}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {choices.map(choice => {
          const isSelected = selected.includes(choice.value);
          const isOptionDisabled = disabled || choice.disabled;

          if (allowMultiple) {
            return (
              <SiriusCheckbox
                key={choice.value}
                label={choice.label}
                details={choice.details}
                checked={isSelected}
                disabled={isOptionDisabled}
                onChange={checked => handleCheckboxChange(choice.value, checked)}
              />
            );
          }

          return (
            <label
              key={choice.value}
              className={`sirius-radio-wrap ${isOptionDisabled ? 'sirius-radio-wrap--disabled' : ''}`}
            >
              <span
                className={`sirius-radio ${isSelected ? 'sirius-radio--checked' : ''} ${
                  isOptionDisabled ? 'sirius-radio--disabled' : ''
                }`}
                aria-hidden="true"
              />
              <input
                type="radio"
                name={name}
                value={choice.value}
                checked={isSelected}
                disabled={isOptionDisabled}
                onChange={() => handleRadioChange(choice.value)}
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
              />
              <div className="sirius-checkbox__label-block">
                <span className="sirius-checkbox__label">{choice.label}</span>
                {choice.details && <span className="sirius-checkbox__details">{choice.details}</span>}
              </div>
            </label>
          );
        })}
      </div>

      {isError && (
        <div className="sirius-field__error" role="alert" style={{ marginTop: '6px' }}>
          <span className="sirius-field__error-icon" aria-hidden="true"><Icon name="alert-circle" size={14} /></span>
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
