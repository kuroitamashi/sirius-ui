'use client';

import React from 'react';
import { Icon } from '../Icon/Icon';
import { SiriusSpinner } from '../Spinner/Spinner';
import './form.css';

export interface SiriusTextFieldProps {
  label?: string;
  /** Libellé lu par les lecteurs d'écran mais masqué à l'écran. */
  labelHidden?: boolean;
  /** Lien à droite du libellé (« Ajouter un code »). */
  labelAction?: { content: string; onAction?: () => void; url?: string };
  details?: string;
  /** Un texte affiche le message ; `true` rougit le champ seul, le message est ailleurs. */
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
  autoFocus?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  icon?: React.ReactNode;
  /** Alignement du texte saisi, `right` pour les montants. */
  align?: 'left' | 'center' | 'right';
  maxLength?: number;
  /** Compteur « 5/70 » à droite, utile avec `maxLength`. */
  showCharacterCount?: boolean;
  /** Croix pour vider le champ, visible dès qu'il contient du texte. */
  clearButton?: boolean;
  onClearButtonClick?: () => void;
  monospaced?: boolean;
  selectTextOnFocus?: boolean;
  /** Petit sablier à droite pendant une recherche ou un calcul. */
  loading?: boolean;
  /** Éléments collés à gauche ou à droite du champ (liste, bouton). */
  connectedLeft?: React.ReactNode;
  connectedRight?: React.ReactNode;
  /** `borderless` : sans contour, pour un champ posé dans une carte grise. */
  variant?: 'inherit' | 'borderless';
  className?: string;
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export function SiriusTextField({
  label,
  labelHidden = false,
  labelAction,
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
  autoFocus,
  prefix,
  suffix,
  icon,
  align,
  maxLength,
  showCharacterCount = false,
  clearButton = false,
  onClearButtonClick,
  monospaced = false,
  selectTextOnFocus = false,
  loading = false,
  connectedLeft,
  connectedRight,
  variant = 'inherit',
  className = '',
  onChange,
  onBlur,
  onFocus,
}: SiriusTextFieldProps) {
  const autoId = React.useId();
  const inputId = id || (name ? `field-${name}` : autoId);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const isError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : undefined;

  // Le compteur et la croix ont besoin du texte courant, même sans `value` contrôlée.
  const [inner, setInner] = React.useState(defaultValue ?? '');
  const current = value ?? inner;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInner(e.target.value);
    onChange?.(e.target.value, e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (selectTextOnFocus) e.target.select();
    onFocus?.(e);
  };

  const clear = () => {
    if (value === undefined && inputRef.current) inputRef.current.value = '';
    setInner('');
    onClearButtonClick?.();
    inputRef.current?.focus();
  };

  const box = (
    <div
      className={[
        'sirius-input-box',
        disabled && 'sirius-input-box--disabled',
        readOnly && 'sirius-input-box--readonly',
        isError && 'sirius-input-box--error',
        variant === 'borderless' && 'sirius-input-box--borderless',
      ].filter(Boolean).join(' ')}
    >
      {icon && <span className="sirius-input__icon">{icon}</span>}
      {prefix && <span className="sirius-input__prefix">{prefix}</span>}

      <input
        ref={inputRef}
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
        autoFocus={autoFocus}
        maxLength={maxLength}
        className={['sirius-input', monospaced && 'sirius-input--monospaced'].filter(Boolean).join(' ')}
        style={align ? { textAlign: align } : undefined}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={handleFocus}
        aria-invalid={isError ? 'true' : undefined}
        aria-busy={loading || undefined}
      />

      {loading && (
        <span className="sirius-input__suffix">
          <SiriusSpinner size="small" accessibilityLabel="Chargement" />
        </span>
      )}
      {clearButton && current !== '' && !disabled && !readOnly && (
        <button type="button" className="sirius-input__clear" onClick={clear} aria-label="Effacer">
          <Icon name="x-circle" size={20} />
        </button>
      )}
      {showCharacterCount && (
        <span className="sirius-input__suffix sirius-input__count" aria-live="polite">
          {maxLength ? `${current.length}/${maxLength}` : current.length}
        </span>
      )}
      {suffix && <span className="sirius-input__suffix">{suffix}</span>}
    </div>
  );

  return (
    <div className={`sirius-field ${disabled ? 'sirius-field--disabled' : ''} ${className}`}>
      {label && (
        <div className={`sirius-field__label-wrap ${labelHidden ? 'sirius-visually-hidden' : ''}`}>
          <label htmlFor={inputId} className="sirius-field__label">
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

      {connectedLeft || connectedRight ? (
        <div className="sirius-field__connected">
          {connectedLeft}
          {box}
          {connectedRight}
        </div>
      ) : box}

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
