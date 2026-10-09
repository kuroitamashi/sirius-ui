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
  /** Libellé lu par les lecteurs d'écran mais masqué à l'écran. */
  labelHidden?: boolean;
  /** Libellé gris dans le cadre, devant la valeur (« Trier par Date »). */
  labelInline?: boolean;
  /** Lien à droite du libellé. */
  labelAction?: { content: string; onAction?: () => void; url?: string };
  details?: string;
  options: (string | SiriusSelectOption)[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  /** Un texte affiche le message ; `true` rougit le champ seul, le message est ailleurs. */
  error?: string | boolean;
  id?: string;
  name?: string;
  className?: string;
  onChange?: (value: string, e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function SiriusSelect({
  label,
  labelHidden = false,
  labelInline = false,
  labelAction,
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
  const autoId = React.useId();
  const selectId = id || autoId;
  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;

  // Libellé dans le cadre : le texte de la valeur commence après lui, on mesure sa largeur.
  const inlineRef = React.useRef<HTMLLabelElement>(null);
  const [inlineWidth, setInlineWidth] = React.useState(0);
  // ResizeObserver : la largeur change quand la police finit de charger.
  React.useLayoutEffect(() => {
    const el = inlineRef.current;
    if (!labelInline || !el) return;
    const ro = new ResizeObserver(() => setInlineWidth(el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [labelInline, label]);

  const normalizedOptions: SiriusSelectOption[] = options.map(opt =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value, e);
  };

  const showLabelAbove = label && !labelInline;

  return (
    <div className={`sirius-field ${disabled ? 'sirius-field--disabled' : ''} ${className}`}>
      {showLabelAbove && (
        <div className={`sirius-field__label-wrap ${labelHidden ? 'sirius-visually-hidden' : ''}`}>
          <label htmlFor={selectId} className="sirius-field__label">
            {label}
            {required && <span style={{ color: '#c01025', marginLeft: '3px' }}>*</span>}
          </label>
          {labelAction && (
            labelAction.url
              ? <a href={labelAction.url} className="sirius-field__label-action">{labelAction.content}</a>
              : <button type="button" className="sirius-field__label-action" onClick={labelAction.onAction}>{labelAction.content}</button>
          )}
        </div>
      )}

      <div className="sirius-select-wrap">
        {labelInline && label && (
          <label ref={inlineRef} htmlFor={selectId} className="sirius-select__inline-label">{label}</label>
        )}
        <select
          id={selectId}
          name={name}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          required={required}
          className={`sirius-select ${isError ? 'sirius-input-box--error' : ''}`}
          style={labelInline && inlineWidth ? { paddingLeft: 10 + inlineWidth + 6 } : undefined}
          onChange={handleChange}
          aria-invalid={isError ? 'true' : undefined}
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

      {errorMessage && (
        <div className="sirius-field__error" role="alert">
          <span className="sirius-field__error-icon" aria-hidden="true"><Icon name="alert-circle" size={14} /></span>
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
