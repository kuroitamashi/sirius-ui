'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { SiriusButton } from '../Button/Button';
import { SiriusCheckbox } from '../Form/Checkbox';
import { SiriusSwitch } from '../Form/Switch';
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
      en largeur passent d'elles-mêmes dans le menu « … ». Une action
      destructive n'est jamais affichée en bouton : elle va dans le menu. */
  promotedActions?: (SiriusBulkAction | SiriusBulkActionMenu)[];
  /** Actions rangées d'emblée dans le menu « … ». Une liste simple, ou une
      liste de groupes séparés par un trait (ex. archiver/supprimer, puis
      catégories, puis export). */
  actions?: SiriusBulkAction[] | SiriusBulkAction[][];
  /** Libellé du compteur. Défaut : « 3 sélectionnés ». */
  label?: (count: number) => string;
  /**
   * Interrupteur à droite de la barre : n'afficher que les lignes cochées.
   * Absent si non fourni ; c'est l'écran qui filtre sa liste.
   */
  showSelected?: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
  };
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

/* Écarts serrés, comme sur l'admin Shopify : 4px entre les boutons, 8px
   entre le compteur et le premier bouton. */
const GAP = 4;
const GAP_SELECTION = 8;

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
  showSelected,
  className = '',
}: SiriusBulkActionsProps) {
  const barreRef = useRef<HTMLDivElement>(null);
  const gaucheRef = useRef<HTMLDivElement>(null);
  const droiteRef = useRef<HTMLDivElement>(null);
  const mesureRef = useRef<HTMLDivElement>(null);
  /* Règle Shopify : une action destructive (supprimer…) ne s'affiche jamais
     en bouton, on ne doit pas pouvoir la déclencher d'un clic distrait. Elle
     va à la fin du premier groupe du menu, en rouge. */
  const enAvant = promotedActions.filter((a) => isMenu(a) || !a.destructive);
  const destructives = promotedActions.filter(
    (a): a is SiriusBulkAction => !isMenu(a) && !!a.destructive
  );
  const groupes: SiriusBulkAction[][] =
    actions.length === 0
      ? []
      : Array.isArray(actions[0])
        ? (actions as SiriusBulkAction[][]).map((g) => [...g])
        : [[...(actions as SiriusBulkAction[])]];
  if (destructives.length) {
    if (groupes.length) groupes[0].push(...destructives);
    else groupes.push(destructives);
  }
  const nbMenu = groupes.reduce((n, g) => n + g.length, 0);

  const [visibles, setVisibles] = useState(enAvant.length);

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
        (droiteRef.current ? droiteRef.current.offsetWidth + GAP * 2 : 0) -
        GAP_SELECTION;
      let total = 0;
      let n = 0;
      for (let i = 0; i < largeurs.length; i++) {
        const reste = largeurs.length - (i + 1) + nbMenu;
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
  }, [promotedActions, nbMenu, selectedCount, showSelected]);

  if (selectedCount <= 0) return null;

  const affichees = enAvant.slice(0, visibles);
  const debordees = enAvant.slice(visibles);

  /* Le menu « … » : d'abord les boutons qui n'ont pas tenu, dans leur ordre,
     puis les actions secondaires. */
  const sections: SiriusActionListSection[] = [];
  const directes = debordees.filter((a): a is SiriusBulkAction => !isMenu(a)).map(versItem);
  if (directes.length) sections.push({ items: directes });
  debordees.filter(isMenu).forEach((m) => sections.push({ title: m.title, items: m.actions.map(versItem) }));
  groupes.forEach((g) => sections.push({ items: g.map(versItem) }));

  const toutCoche = selectedCount >= totalCount;

  const bouton = (a: SiriusBulkAction | SiriusBulkActionMenu, key: React.Key) =>
    isMenu(a) ? (
      <SiriusActionList
        key={key}
        items={a.actions.map(versItem)}
        trigger={
          <SiriusButton variant="plain" size="slim" disclosure className="sirius-bulk-actions__btn">
            {a.title}
          </SiriusButton>
        }
      />
    ) : (
      <SiriusButton
        key={key}
        variant="plain"
        size="slim"
        className={[
          'sirius-bulk-actions__btn',
          a.destructive && 'sirius-bulk-actions__btn--destructive',
        ].filter(Boolean).join(' ')}
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
      <div className="sirius-bulk-actions__gauche">
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
          {/* Le compteur est un menu : tout cocher ou tout décocher. */}
          <SiriusActionList
            items={[
              ...(toutCoche
                ? []
                : [{ content: `Tout sélectionner (${totalCount})`, onAction: () => onToggleAll(true) }]),
              { content: 'Tout désélectionner', onAction: () => onToggleAll(false) },
            ]}
            trigger={
              <SiriusButton
                variant="plain"
                size="slim"
                disclosure
                className="sirius-bulk-actions__count"
                aria-live="polite"
              >
                {label(selectedCount)}
              </SiriusButton>
            }
          />
        </div>

        <div className="sirius-bulk-actions__actions">
          {affichees.map((a, i) => bouton(a, i))}
          {sections.length > 0 && (
            <SiriusActionList
              sections={sections}
              trigger={
                <SiriusButton
                  variant="plain"
                  size="slim"
                  iconOnly
                  icon="menu-horizontal"
                  ariaLabel="Plus d'actions"
                  className="sirius-bulk-actions__btn"
                />
              }
            />
          )}
        </div>
      </div>

      {showSelected && (
        <div ref={droiteRef} className="sirius-bulk-actions__droite">
          <SiriusSwitch
            checked={showSelected.checked}
            onChange={showSelected.onChange}
            label={showSelected.label ?? 'Afficher la sélection'}
          />
        </div>
      )}

      {/* Copie invisible pour mesurer la largeur de chaque bouton. */}
      <div ref={mesureRef} className="sirius-bulk-actions__mesure" aria-hidden="true">
        {enAvant.map((a, i) =>
          isMenu(a) ? (
            <SiriusButton key={i} variant="plain" size="slim" disclosure tabIndex={-1} className="sirius-bulk-actions__btn">
              {a.title}
            </SiriusButton>
          ) : (
            <SiriusButton key={i} variant="plain" size="slim" tabIndex={-1} className="sirius-bulk-actions__btn">
              {a.content}
            </SiriusButton>
          )
        )}
        <SiriusButton variant="plain" size="slim" iconOnly icon="menu-horizontal" ariaLabel="" tabIndex={-1} className="sirius-bulk-actions__btn" />
      </div>
    </div>
  );
}

export default SiriusBulkActions;
