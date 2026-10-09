'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { SiriusButton } from '../Button/Button';
import { SiriusCheckbox } from '../Form/Checkbox';
import {
  SiriusActionList,
  type SiriusActionListItemDescriptor,
  type SiriusActionListSection,
} from '../ActionList/ActionList';
import type { IconName } from '../Icon/Icon';
import './bulk-actions.css';

/** Une action appliquée à toutes les lignes cochées. */
export interface SiriusBulkAction {
  content: string;
  onAction?: () => void;
  /** En rouge : suppression, annulation… */
  destructive?: boolean;
  disabled?: boolean;
  icon?: IconName;
}

/** Une action mise en avant qui ouvre un menu (ex. « Exporter » → CSV, PDF). */
export interface SiriusBulkActionMenu {
  title: string;
  actions: SiriusBulkAction[];
}

export interface SiriusBulkActionsProps {
  /** Nombre de lignes cochées. À 0, la barre ne s'affiche pas. */
  selectedCount: number;
  /** Nombre total de lignes sélectionnables. */
  totalCount: number;
  /**
   * Clic sur la case : `true` pour tout cocher, `false` pour tout décocher.
   * Comme chez Polaris, une sélection partielle se complète, une sélection
   * complète se vide.
   */
  onToggleAll: (selectAll: boolean) => void;
  /** Actions affichées en boutons, dans l'ordre. Celles qui ne tiennent pas
      en largeur passent d'elles-mêmes dans le menu « … ». */
  promotedActions?: (SiriusBulkAction | SiriusBulkActionMenu)[];
  /** Actions rangées d'emblée dans le menu « … ». */
  actions?: SiriusBulkAction[];
  /** Libellé du compteur. Défaut : « 3 sélectionnés ». */
  label?: (count: number) => React.ReactNode;
  className?: string;
}

const isMenu = (a: SiriusBulkAction | SiriusBulkActionMenu): a is SiriusBulkActionMenu =>
  'actions' in a;

const versItem = (a: SiriusBulkAction): SiriusActionListItemDescriptor => ({
  content: a.content,
  onAction: a.onAction,
  destructive: a.destructive,
  disabled: a.disabled,
  icon: a.icon,
});

const libelleParDefaut = (n: number) => `${n} sélectionné${n > 1 ? 's' : ''}`;

const GAP = 8;

/**
 * Barre d'actions groupées, calquée sur les BulkActions de Polaris.
 * Le composant ne connaît aucune action : chaque écran lui passe les siennes
 * (produits, commandes, clients…). Il gère seul le compteur, la case « tout
 * sélectionner » et le passage des boutons dans « … » quand la place manque.
 */
export function SiriusBulkActions({
  selectedCount,
  totalCount,
  onToggleAll,
  promotedActions = [],
  actions = [],
  label = libelleParDefaut,
  className = '',
}: SiriusBulkActionsProps) {
  const barreRef = useRef<HTMLDivElement>(null);
  const gaucheRef = useRef<HTMLDivElement>(null);
  const mesureRef = useRef<HTMLDivElement>(null);
  const [visibles, setVisibles] = useState(promotedActions.length);

  /* Combien de boutons tiennent : on mesure une copie invisible de tous les
     boutons, puis on garde ceux qui rentrent dans la place laissée par le
     compteur et le bouton « … ». */
  useLayoutEffect(() => {
    const barre = barreRef.current;
    const mesure = mesureRef.current;
    if (!barre || !mesure) return;
    const calculer = () => {
      const largeurs = Array.from(mesure.children).map((e) => (e as HTMLElement).offsetWidth);
      const plus = largeurs.pop() ?? 0; // le dernier enfant mesuré est le « … »
      const style = getComputedStyle(barre);
      const dispo =
        barre.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight) -
        (gaucheRef.current?.offsetWidth ?? 0) -
        GAP * 2;
      let total = 0;
      let n = 0;
      for (let i = 0; i < largeurs.length; i++) {
        const reste = largeurs.length - (i + 1) + actions.length;
        // Le « … » n'occupe de la place que s'il reste quelque chose à y ranger.
        const besoin = total + largeurs[i] + (i > 0 ? GAP : 0) + (reste > 0 ? GAP + plus : 0);
        if (besoin > dispo) break;
        total += largeurs[i] + (i > 0 ? GAP : 0);
        n++;
      }
      setVisibles(n);
    };
    calculer();
    const ro = new ResizeObserver(calculer);
    ro.observe(barre);
    return () => ro.disconnect();
  }, [promotedActions, actions.length, selectedCount]);

  if (selectedCount <= 0) return null;

  const affichees = promotedActions.slice(0, visibles);
  const debordees = promotedActions.slice(visibles);

  /* Le menu « … » : d'abord les boutons qui n'ont pas tenu, dans leur ordre,
     puis les actions secondaires. */
  const sections: SiriusActionListSection[] = [];
  const directes = debordees.filter((a): a is SiriusBulkAction => !isMenu(a)).map(versItem);
  if (directes.length) sections.push({ items: directes });
  debordees.filter(isMenu).forEach((m) => sections.push({ title: m.title, items: m.actions.map(versItem) }));
  if (actions.length) sections.push({ items: actions.map(versItem) });

  const toutCoche = selectedCount >= totalCount;

  const bouton = (a: SiriusBulkAction | SiriusBulkActionMenu, key: React.Key) =>
    isMenu(a) ? (
      <SiriusActionList
        key={key}
        items={a.actions.map(versItem)}
        placement="end"
        trigger={
          <SiriusButton size="slim" disclosure>
            {a.title}
          </SiriusButton>
        }
      />
    ) : (
      <SiriusButton
        key={key}
        size="slim"
        className={a.destructive ? 'sirius-bulk-actions__destructive' : undefined}
        disabled={a.disabled}
        onClick={a.onAction}
      >
        {a.content}
      </SiriusButton>
    );

  return (
    <div
      ref={barreRef}
      className={['sirius-bulk-actions', className].filter(Boolean).join(' ')}
      role="toolbar"
      aria-label="Actions groupées"
    >
      <div ref={gaucheRef} className="sirius-bulk-actions__selection">
        <SiriusCheckbox
          checked={toutCoche ? true : 'indeterminate'}
          onChange={() => onToggleAll(!toutCoche)}
          label={
            <span className="sirius-bulk-actions__sr">
              {toutCoche ? `Tout désélectionner (${totalCount})` : `Tout sélectionner (${totalCount})`}
            </span>
          }
        />
        <span className="sirius-bulk-actions__count" aria-live="polite">
          {label(selectedCount)}
        </span>
      </div>

      <div className="sirius-bulk-actions__actions">
        {affichees.map((a, i) => bouton(a, i))}
        {sections.length > 0 && (
          <SiriusActionList
            sections={sections}
            placement="end"
            trigger={
              <SiriusButton size="slim" iconOnly icon="menu-horizontal" ariaLabel="Plus d'actions" />
            }
          />
        )}
      </div>

      {/* Copie invisible pour mesurer la largeur de chaque bouton. */}
      <div ref={mesureRef} className="sirius-bulk-actions__mesure" aria-hidden="true">
        {promotedActions.map((a, i) =>
          isMenu(a) ? (
            <SiriusButton key={i} size="slim" disclosure tabIndex={-1}>
              {a.title}
            </SiriusButton>
          ) : (
            <SiriusButton key={i} size="slim" tabIndex={-1}>
              {a.content}
            </SiriusButton>
          )
        )}
        <SiriusButton size="slim" iconOnly icon="menu-horizontal" ariaLabel="" tabIndex={-1} />
      </div>
    </div>
  );
}

export default SiriusBulkActions;
