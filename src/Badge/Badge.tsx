'use client';

import React from 'react';
import './badge.css';

export type SiriusBadgeTone =
  | 'neutral'
  | 'info'
  | 'success'
  | 'attention'
  | 'warning'
  | 'critical'
  | 'subdued'
  | 'wave'
  | 'orange_money'
  | 'especes'
  | 'cash_on_delivery';

export type SiriusBadgePip = 'filled' | 'hollow' | 'slashed' | boolean;

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
  variant?: 'subdued' | 'strong';
  pip?: SiriusBadgePip;
  hasPip?: boolean; // rétrocompatibilité
  icon?: React.ReactNode;
  className?: string;
}

export function SiriusBadge({
  children,
  kind,
  tone,
  variant = 'subdued',
  className = '',
}: SiriusBadgeProps) {
  const effectiveTone = tone ?? (kind ? resolveTone(kind) : 'neutral');
  const label = children ?? (kind ? LABELS[kind] ?? kind : '');

  return (
    <span
      className={[
        'sirius-badge',
        `sirius-badge--${effectiveTone}`,
        variant === 'strong' && 'sirius-badge--strong',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </span>
  );
}
