'use client';

import React from 'react';
import { Icon } from '../Icon/Icon';
import { SiriusButton } from '../Button/Button';
import './contextual-save-bar.css';

export interface SiriusContextualSaveBarAction {
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  onAction?: () => void;
}

export interface SiriusContextualSaveBarProps {
  message?: React.ReactNode;
  saveAction?: SiriusContextualSaveBarAction;
  discardAction?: SiriusContextualSaveBarAction;
  visible?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export function SiriusContextualSaveBar({
  message = 'Modifications non enregistrées',
  saveAction,
  discardAction,
  visible = false,
  className = '',
  fullWidth = false,
}: SiriusContextualSaveBarProps) {
  const isDefaultMessage =
    message === 'Modifications non enregistrées' || message === 'Unsaved changes';

  return (
    <div
      className={`sirius-savebar ${visible ? 'sirius-savebar--visible' : ''} ${className}`}
      role="region"
      aria-label="Barre d'actions contextuelle"
      aria-hidden={!visible}
    >
      <div className={`sirius-savebar__card ${fullWidth ? 'sirius-savebar__card--full' : ''}`}>
        <div className="sirius-savebar__message">
          <Icon name="alert-triangle" size={16} className="sirius-savebar__icon" />
          <span className="sirius-savebar__text">
            {isDefaultMessage ? (
              <>
                <span className="sirius-savebar__text-full">Modifications non enregistrées</span>
                <span className="sirius-savebar__text-short">Non enregistré</span>
              </>
            ) : (
              message
            )}
          </span>
        </div>
        <div className="sirius-savebar__actions">
          {discardAction && (
            <SiriusButton
              variant="plain"
              onClick={discardAction.onAction}
              disabled={discardAction.disabled || saveAction?.loading}
            >
              {discardAction.label || 'Annuler'}
            </SiriusButton>
          )}
          {saveAction && (
            <SiriusButton
              variant="success"
              onClick={saveAction.onAction}
              loading={saveAction.loading}
              disabled={saveAction.disabled}
            >
              {saveAction.label || 'Enregistrer'}
            </SiriusButton>
          )}
        </div>
      </div>
    </div>
  );
}

export { SiriusContextualSaveBar as ContextualSaveBar };
