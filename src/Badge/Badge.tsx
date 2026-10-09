'use client';

import React from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import './badge.css';

export type SiriusBadgeTone =
  | 'neutral'
  | 'info'
  | 'success'
  | 'attention'
  | 'warning'
  | 'critical'
  | 'new'
  | 'magic'
  | 'read-only'
  | 'enabled'
  | 'subdued'
  | 'wave'
  | 'orange_money'
  | 'especes'
  | 'cash_on_delivery';

export type SiriusBadgePip = 'filled' | 'hollow' | 'slashed' | boolean;

export type SiriusBadgeProgress = 'complete' | 'partiallyComplete' | 'incomplete';

/* Les trois pastilles de progression de Polaris. Elles ne sont pas dans
   @shopify/polaris-icons : Polaris les dessine dans son Badge. Tracés repris
   tels quels, cadre 20x20 comme les autres icônes. */
const PROGRESS_PATHS: Record<SiriusBadgeProgress, { d: string; evenOdd?: boolean }> = {
  complete: {
    d: 'M6 10c0-.93 0-1.395.102-1.776a3 3 0 0 1 2.121-2.122C8.605 6 9.07 6 10 6c.93 0 1.395 0 1.776.102a3 3 0 0 1 2.122 2.122C14 8.605 14 9.07 14 10s0 1.395-.102 1.777a3 3 0 0 1-2.122 2.12C11.395 14 10.93 14 10 14s-1.395 0-1.777-.102a3 3 0 0 1-2.12-2.121C6 11.395 6 10.93 6 10Z',
  },
  partiallyComplete: {
    evenOdd: true,
    d: 'm8.888 6.014-.017-.018-.02.02c-.253.013-.45.038-.628.086a3 3 0 0 0-2.12 2.122C6 8.605 6 9.07 6 10s0 1.395.102 1.777a3 3 0 0 0 2.121 2.12C8.605 14 9.07 14 10 14c.93 0 1.395 0 1.776-.102a3 3 0 0 0 2.122-2.121C14 11.395 14 10.93 14 10c0-.93 0-1.395-.102-1.776a3 3 0 0 0-2.122-2.122C11.395 6 10.93 6 10 6c-.475 0-.829 0-1.112.014ZM8.446 7.34a1.75 1.75 0 0 0-1.041.94l4.314 4.315c.443-.2.786-.576.941-1.042L8.446 7.34Zm4.304 2.536L10.124 7.25c.908.001 1.154.013 1.329.06a1.75 1.75 0 0 1 1.237 1.237c.047.175.059.42.06 1.329ZM8.547 12.69c.182.05.442.06 1.453.06h.106L7.25 9.894V10c0 1.01.01 1.27.06 1.453a1.75 1.75 0 0 0 1.237 1.237Z',
  },
  incomplete: {
    evenOdd: true,
    d: 'M8.547 12.69c.183.05.443.06 1.453.06s1.27-.01 1.453-.06a1.75 1.75 0 0 0 1.237-1.237c.05-.182.06-.443.06-1.453s-.01-1.27-.06-1.453a1.75 1.75 0 0 0-1.237-1.237c-.182-.05-.443-.06-1.453-.06s-1.27.01-1.453.06A1.75 1.75 0 0 0 7.31 8.547c-.05.183-.06.443-.06 1.453s.01 1.27.06 1.453a1.75 1.75 0 0 0 1.237 1.237ZM6.102 8.224C6 8.605 6 9.07 6 10s0 1.395.102 1.777a3 3 0 0 0 2.122 2.12C8.605 14 9.07 14 10 14s1.395 0 1.777-.102a3 3 0 0 0 2.12-2.121C14 11.395 14 10.93 14 10c0-.93 0-1.395-.102-1.776a3 3 0 0 0-2.121-2.122C11.395 6 10.93 6 10 6c-.93 0-1.395 0-1.776.102a3 3 0 0 0-2.122 2.122Z',
  },
};

/* Ancienne prop `pip` : même idée, autres noms. */
const PIP_TO_PROGRESS: Record<string, SiriusBadgeProgress> = {
  filled: 'complete',
  true: 'complete',
  slashed: 'partiallyComplete',
  hollow: 'incomplete',
};

const LABELS: Record<string, string> = {
  payee: 'Payée',
  paid: 'Payée',
  en_attente: 'En attente',
  pending: 'En attente',
  created: 'Créée',
  echec: 'Échec',
  failed: 'Échec',
  annulee: 'Annulée',
  cancelled: 'Annulée',
  a_traiter: 'À traiter',
  expediee: 'Expédiée',
  livree: 'Livrée',
  wave: 'Wave',
  orange_money: 'Orange Money',
  especes: 'Espèces à la livraison',
  cash_on_delivery: 'Espèces',
  starter: 'Starter',
  premium: 'Premium',
  custom: 'Custom',
  a_jour: 'À jour',
  retard: 'En retard',
  suspendu: 'Suspendu',
  actif: 'Actif',
  inactif: 'Inactif',
  published: 'En ligne',
  draft: 'Brouillon',
  outOfStock: 'Rupture',
  rupture: 'Rupture',
  epuise: 'Épuisé',
  featured: 'Vedette',
  expire: 'Expiré',
  due: 'À régler',
  en_retard: 'En retard',
  desactive: 'Désactivé',
  resilie: 'Résilié',
  gele: 'Gelé',
  gerant: 'Gérant',
  vendeur: 'Vendeur',
};

// Mappe un statut e-commerce vers son tone Sirius
function resolveTone(kind: string): SiriusBadgeTone {
  switch (kind) {
    case 'payee':
    case 'paid':
    case 'livree':
    case 'a_jour':
    case 'actif':
    case 'published':
      return 'success';
    case 'a_traiter':
    case 'en_attente':
    case 'pending':
    case 'created':
    case 'gele':
      return 'attention';
    case 'retard':
    case 'en_retard':
    case 'due':
    case 'expire':
      return 'warning';
    case 'echec':
    case 'failed':
    case 'suspendu':
    case 'outOfStock':
    case 'rupture':
    case 'epuise':
    case 'resilie':
      return 'critical';
    case 'expediee':
    case 'featured':
      return 'info';
    case 'draft':
    case 'inactif':
    case 'desactive':
      return 'subdued';
    case 'wave':
      return 'wave';
    case 'orange_money':
      return 'orange_money';
    case 'especes':
    case 'cash_on_delivery':
      return 'especes';
    case 'annulee':
    case 'cancelled':
    default:
      return 'neutral';
  }
}

export interface SiriusBadgeProps {
  children?: React.ReactNode;
  kind?: string;
  tone?: SiriusBadgeTone;
  /** `strong` : fond plein, pour attirer l'oeil (info, success, warning, attention, critical) */
  variant?: 'subdued' | 'strong';
  /** `medium` (20px de haut, par défaut) ou `large` (24px) */
  size?: 'medium' | 'large';
  /** Pastille d'avancement à gauche, façon Polaris */
  progress?: SiriusBadgeProgress;
  /** @deprecated Utiliser `progress`. filled = complete, slashed = partiallyComplete, hollow = incomplete */
  pip?: SiriusBadgePip;
  hasPip?: boolean; // rétrocompatibilité
  /** Icône à gauche : nom d'icône Sirius ou ReactNode */
  icon?: IconName | React.ReactNode;
  className?: string;
}

export function SiriusBadge({
  children,
  kind,
  tone,
  variant = 'subdued',
  size = 'medium',
  progress,
  pip,
  hasPip,
  icon,
  className = '',
}: SiriusBadgeProps) {
  const effectiveTone = tone ?? (kind ? resolveTone(kind) : 'neutral');
  const label = children ?? (kind ? LABELS[kind] ?? kind : '');
  const effectiveProgress =
    progress ?? (pip ? PIP_TO_PROGRESS[String(pip)] : hasPip ? 'complete' : undefined);

  let prefix: React.ReactNode = null;
  if (effectiveProgress) {
    const { d, evenOdd } = PROGRESS_PATHS[effectiveProgress];
    prefix = (
      <svg viewBox="0 0 20 20" width={20} height={20} fill="currentColor" aria-hidden="true" focusable="false">
        <path d={d} fillRule={evenOdd ? 'evenodd' : undefined} />
      </svg>
    );
  } else if (icon) {
    prefix = typeof icon === 'string' ? <Icon name={icon as IconName} size={20} /> : icon;
  }

  return (
    <span
      className={[
        'sirius-badge',
        `sirius-badge--${effectiveTone}`,
        variant === 'strong' && 'sirius-badge--strong',
        size === 'large' && 'sirius-badge--large',
        prefix && 'sirius-badge--with-icon',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {prefix && <span className="sirius-badge__icon">{prefix}</span>}
      {label}
    </span>
  );
}
