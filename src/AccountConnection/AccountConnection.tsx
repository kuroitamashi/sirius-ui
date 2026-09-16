'use client';

import React from 'react';
import { SiriusButton, type SiriusButtonProps } from '../Button/Button';
import './account-connection.css';

export interface SiriusAccountConnectionAction {
  /** Texte du bouton d'action */
  text?: string;
  /** Alias Polaris pour text */
  content?: string;
  /** Gestionnaire de clic */
  onAction?: () => void;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  /** Indique si l'action est en cours de traitement */
  loading?: boolean;
  /** Désactive le bouton d'action */
  disabled?: boolean;
  /** Style destructeur (ex: déconnexion définitive) */
  destructive?: boolean;
  /** Variante spécifique du bouton Sirius */
  variant?: SiriusButtonProps['variant'];
}

export interface SiriusAccountConnectionProps {
  /** Nom du compte, application ou service tiers */
  accountName?: string;
  /** Titre personnalisé. Si omis, prend `accountName` */
  title?: React.ReactNode;
  /** Détails supplémentaires ou statut textuel */
  details?: React.ReactNode;
  /** Conditions d'utilisation ou avertissements légaux affichés au bas */
  termsOfService?: React.ReactNode;
  /** Indique si le compte est actuellement connecté */
  connected?: boolean;
  /** Configuration du bouton d'action (Connecter / Déconnecter) */
  action?: SiriusAccountConnectionAction;
  /** URL de l'avatar ou logo du compte */
  avatarUrl?: string;
  /** Initiales pour l'avatar. Si omis et que `accountName` existe, calculé automatiquement */
  avatarInitials?: string;
  /** Couleur d'arrière-plan de l'avatar à initiales (défaut: magenta vibrant inspiré Polaris) */
  avatarColor?: string;
  /** Badge optionnel affiché à côté du titre */
  badge?: React.ReactNode;
  /** Contenu additionnel inséré dans le corps */
  children?: React.ReactNode;
  /** Classe CSS additionnelle */
  className?: string;
}

/**
 * Calcule les initiales à partir du nom de compte (ex: "Example App" -> "EA")
 */
function getInitials(name?: string): string | undefined {
  if (!name) return undefined;
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function SiriusAccountConnection({
  accountName = '',
  title,
  details,
  termsOfService,
  connected = false,
  action,
  avatarUrl,
  avatarInitials,
  avatarColor,
  badge,
  children,
  className = '',
}: SiriusAccountConnectionProps) {
  const displayTitle = title ?? accountName;
  const initials = avatarInitials || getInitials(accountName);

  // Détermination de l'action
  const actionText = action?.text || action?.content || (connected ? 'Déconnecter' : 'Connecter');
  const actionHandler = () => {
    if (action?.onAction) {
      action.onAction();
    }
  };

  // Variante du bouton :
  // - Si spécifié explicitement dans action.variant, on l'utilise
  // - Si connecté : secondary par défaut (ou destructive si demandé)
  // - Si non connecté : primary par défaut
  const buttonVariant: SiriusButtonProps['variant'] =
    action?.variant ||
    (action?.destructive
      ? 'destructive-plain'
      : connected
      ? 'secondary'
      : 'primary');

  const showAvatar = connected && (avatarUrl || initials);

  return (
    <section
      className={`sirius-account-connection ${
        connected ? 'sirius-account-connection--connected' : ''
      } ${className}`}
    >
      <div className="sirius-account-connection__main">
        <div className="sirius-account-connection__content">
          {showAvatar && (
            <div
              className="sirius-account-connection__avatar"
              style={avatarColor ? { backgroundColor: avatarColor } : undefined}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={accountName || 'Avatar'}
                  className="sirius-account-connection__avatar-img"
                />
              ) : (
                <span className="sirius-account-connection__avatar-initials">
                  {initials}
                </span>
              )}
            </div>
          )}

          <div className="sirius-account-connection__text">
            <div className="sirius-account-connection__header">
              {typeof displayTitle === 'string' ? (
                <h2 className="sirius-account-connection__title">{displayTitle}</h2>
              ) : (
                displayTitle
              )}
              {badge && <div className="sirius-account-connection__badge">{badge}</div>}
            </div>

            {details && (
              <div className="sirius-account-connection__details">{details}</div>
            )}
          </div>
        </div>

        <div className="sirius-account-connection__action">
          <SiriusButton
            variant={buttonVariant}
            onClick={action?.onClick || actionHandler}
            loading={action?.loading}
            disabled={action?.disabled}
          >
            {actionText}
          </SiriusButton>
        </div>
      </div>

      {children && (
        <div className="sirius-account-connection__body">{children}</div>
      )}

      {termsOfService && (
        <div className="sirius-account-connection__terms">{termsOfService}</div>
      )}
    </section>
  );
}

// Alias pour compatibilité Polaris
export { SiriusAccountConnection as AccountConnection };
