'use client';

import React, { useState } from 'react';
import { Icon } from '../Icon/Icon';
import { SiriusCheckbox } from '../Form/Checkbox';
import { SiriusBulkActions, type SiriusBulkActionsProps } from '../BulkActions/BulkActions';
import { SiriusSpinner } from '../Spinner/Spinner';
import { SiriusPagination } from '../Pagination';
import type { SiriusPaginationProps } from '../Pagination';
import './data-table.css';

export type ColumnContentType = 'text' | 'numeric';
export type SortDirection = 'ascending' | 'descending' | 'none';
export type DataTableRowTone = 'subdued' | 'success' | 'warning' | 'critical';

export type SiriusDataTablePagination = SiriusPaginationProps;

/**
 * Le seul tableau de Sirius, depuis le 2026-10-09 : liste de ressources
 * (commandes, produits, clientes : on coche, on ouvre) comme tableau de
 * chiffres (rapport des ventes : totaux, colonnes figées). Mise en page à
 * plat de l'admin de référence : pas de carte, en-tête en bande grise.
 */
export interface SiriusDataTableProps {
  /** Titre au-dessus du tableau (ex. « Ventes par produit ») */
  title?: React.ReactNode;
  /** Type de chaque colonne : 'text' à gauche, 'numeric' à droite en chiffres alignés */
  columnContentTypes: ColumnContentType[];
  /** Intitulés des colonnes */
  headings: React.ReactNode[];
  /** Lignes (tableau 2D de cellules) */
  rows: React.ReactNode[][];
  /** Ligne de totaux, une valeur par colonne */
  totals?: React.ReactNode[];
  /** Libellé de la cellule de totaux (défaut : « Total ») */
  totalsName?: { singular: string; plural: string } | string;
  /** Totaux en bas plutôt qu'en haut */
  showTotalsInFooter?: boolean;
  /** Colonnes triables, une valeur par colonne */
  sortable?: boolean[];
  defaultSortDirection?: SortDirection;
  initialSortColumnIndex?: number;
  /** Clic sur un intitulé triable. C'est l'écran qui trie ses lignes. */
  onSort?: (columnIndex: number, direction: SortDirection) => void;
  /** Texte de pied (ex. « 3 commandes sur 47 ») */
  footerContent?: React.ReactNode;
  /** Lignes plus serrées */
  increasedTableDensity?: boolean;
  /** Une ligne sur deux légèrement grisée */
  hasZebraStriping?: boolean;
  /** En-tête figé au défilement vertical */
  stickyHeader?: boolean;
  maxHeight?: string | number;
  /** Première colonne figée au défilement horizontal */
  fixedFirstColumns?: number;
  pagination?: SiriusDataTablePagination;
  /** Teinte au survol des lignes (défaut : oui) */
  hoverable?: boolean;
  /** Coupe les textes trop longs sur « … » */
  truncate?: boolean;
  className?: string;
  style?: React.CSSProperties;

  /** Une case à cocher au début de chaque ligne */
  selectable?: boolean;
  /** Identifiant stable de chaque ligne (défaut : sa position) */
  rowIds?: string[];
  /** Lignes cochées (contrôlé). Sans cette prop, le tableau garde sa sélection seul. */
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Barre posée sur l'en-tête dès qu'une ligne est cochée */
  bulkActions?: Omit<SiriusBulkActionsProps, 'selectedCount' | 'totalCount' | 'onToggleAll'>;
  /** Clic sur une ligne : ouvrir la fiche. Dès qu'une ligne est cochée, le clic coche. */
  onRowClick?: (rowIndex: number) => void;
  /** Fond teinté d'une ligne : grisée, réussie, à surveiller, en erreur */
  rowTone?: (rowIndex: number) => DataTableRowTone | undefined;
  /** Ligne grisée, ni cochable ni cliquable */
  isRowDisabled?: (rowIndex: number) => boolean;
  /** Bandeau « Chargement… » sous l'en-tête, lignes estompées */
  loading?: boolean;
  loadingLabel?: string;
  /** Contenu affiché quand il n'y a aucune ligne */
  emptyState?: React.ReactNode;
}

export function SiriusDataTable({
  title,
  columnContentTypes,
  headings,
  rows,
  totals,
  totalsName = 'Total',
  showTotalsInFooter = false,
  sortable,
  defaultSortDirection = 'ascending',
  initialSortColumnIndex,
  onSort,
  footerContent,
  increasedTableDensity = false,
  hasZebraStriping = false,
  stickyHeader = false,
  maxHeight,
  fixedFirstColumns = 0,
  pagination,
  hoverable = true,
  truncate = false,
  className = '',
  style,
  selectable = false,
  rowIds,
  selectedIds,
  onSelectionChange,
  bulkActions,
  onRowClick,
  rowTone,
  isRowDisabled,
  loading = false,
  loadingLabel = 'Chargement…',
  emptyState,
}: SiriusDataTableProps) {
  const [sortedIndex, setSortedIndex] = useState<number | undefined>(initialSortColumnIndex);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);

  const handleSort = (index: number) => {
    const next: SortDirection =
      sortedIndex === index && sortDirection === 'ascending' ? 'descending' : 'ascending';
    setSortedIndex(index);
    setSortDirection(next);
    onSort?.(index, next);
  };

  // Sélection
  const [innerSelection, setInnerSelection] = useState<string[]>([]);
  const selection = selectedIds ?? innerSelection;
  const setSelection = (ids: string[]) => {
    if (selectedIds === undefined) setInnerSelection(ids);
    onSelectionChange?.(ids);
  };
  const ids = rows.map((_, i) => rowIds?.[i] ?? String(i));
  const selectableIds = ids.filter((_, i) => !isRowDisabled?.(i));
  const selectedCount = selection.filter((id) => selectableIds.includes(id)).length;
  const allState: boolean | 'indeterminate' =
    selectedCount === 0 ? false : selectedCount === selectableIds.length ? true : 'indeterminate';
  const toggle = (id: string) =>
    setSelection(selection.includes(id) ? selection.filter((x) => x !== id) : [...selection, id]);
  const toggleAll = (all: boolean) => setSelection(all ? selectableIds : []);
  const selecting = selectable && selectedCount > 0;

  const colCount = headings.length + (selectable ? 1 : 0);
  const totalsLabel = typeof totalsName === 'string' ? totalsName : totalsName?.singular ?? 'Total';

  const renderTotalsRow = (isFooterPosition: boolean) => {
    if (!totals || totals.length === 0) return null;
    return (
      <tr
        className={[
          'sirius-data-table__row--totals',
          isFooterPosition && 'sirius-data-table__row--totals-footer',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {selectable && <td className="sirius-data-table__cell--checkbox" />}
        {totals.map((totalValue, idx) => (
          <td key={`total-${idx}`} className={`sirius-data-table__cell--${columnContentTypes[idx] ?? 'text'}`}>
            {idx === 0 ? totalValue || totalsLabel : totalValue}
          </td>
        ))}
      </tr>
    );
  };

  return (
    <div className={['sirius-data-table-wrapper', className].filter(Boolean).join(' ')} style={style}>
      {title && <h2 className="sirius-data-table__title">{title}</h2>}

      <div
        className={['sirius-data-table-card', stickyHeader && 'sirius-data-table-card--sticky']
          .filter(Boolean)
          .join(' ')}
      >
        <div className="sirius-data-table__scroll-container" style={{ maxHeight: maxHeight || undefined }}>
          <table
            className={[
              'sirius-data-table',
              increasedTableDensity && 'sirius-data-table--dense',
              hasZebraStriping && 'sirius-data-table--zebra',
              stickyHeader && 'sirius-data-table--sticky',
              fixedFirstColumns > 0 && 'sirius-data-table--fixed-first',
              hoverable && 'sirius-data-table--hoverable',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-busy={loading || undefined}
          >
            <thead className={selecting ? 'sirius-data-table__thead--selecting' : undefined}>
              <tr>
                {selectable && (
                  <th scope="col" className="sirius-data-table__cell--checkbox">
                    <SiriusCheckbox
                      label="Tout sélectionner"
                      labelHidden
                      checked={allState}
                      disabled={selectableIds.length === 0}
                      onChange={() => toggleAll(allState !== true)}
                    />
                  </th>
                )}
                {headings.map((heading, idx) => {
                  const contentType = columnContentTypes[idx] ?? 'text';
                  const isColSortable = Boolean(sortable?.[idx]);
                  const isSorted = sortedIndex === idx;
                  return (
                    <th
                      key={idx}
                      scope="col"
                      className={`sirius-data-table__cell--${contentType}`}
                      aria-sort={isColSortable ? (isSorted ? (sortDirection as 'ascending' | 'descending') : 'none') : undefined}
                    >
                      {isColSortable ? (
                        <button
                          type="button"
                          className={['sirius-data-table__sort', isSorted && 'sirius-data-table__sort--active']
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => handleSort(idx)}
                        >
                          {heading}
                          <Icon name={isSorted && sortDirection === 'ascending' ? 'arrow-up' : 'arrow-down'} size={16} />
                        </button>
                      ) : (
                        heading
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr className="sirius-data-table__loading-row">
                  <td colSpan={colCount}>
                    <SiriusSpinner size="small" accessibilityLabel={loadingLabel} />
                    <span>{loadingLabel}</span>
                  </td>
                </tr>
              )}

              {!showTotalsInFooter && renderTotalsRow(false)}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={colCount} className="sirius-data-table__empty">
                    {emptyState ?? 'Aucune donnée pour le moment.'}
                  </td>
                </tr>
              )}

              {rows.map((row, rowIdx) => {
                const id = ids[rowIdx];
                const disabled = isRowDisabled?.(rowIdx) ?? false;
                const selected = selectable && selection.includes(id);
                const tone = rowTone?.(rowIdx);
                const clickable = !disabled && (selecting || !!onRowClick);
                return (
                  <tr
                    key={id}
                    className={[
                      'sirius-data-table__row',
                      // première ligne blanche, puis une sur deux grisée
                      hasZebraStriping && rowIdx % 2 === 1 && 'sirius-data-table__row--zebra-striped',
                      clickable && 'sirius-data-table__row--clickable',
                      selected && 'sirius-data-table__row--selected',
                      disabled && 'sirius-data-table__row--disabled',
                      tone && `sirius-data-table__row--${tone}`,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-selected={selectable ? selected : undefined}
                    aria-disabled={disabled || undefined}
                    onClick={
                      clickable ? () => (selecting ? toggle(id) : onRowClick?.(rowIdx)) : undefined
                    }
                  >
                    {selectable && (
                      // la case ne doit jamais ouvrir la ligne
                      <td className="sirius-data-table__cell--checkbox" onClick={(e) => e.stopPropagation()}>
                        <SiriusCheckbox
                          label="Sélectionner la ligne"
                          labelHidden
                          checked={selected}
                          disabled={disabled}
                          onChange={() => toggle(id)}
                        />
                      </td>
                    )}
                    {row.map((cell, cellIdx) => {
                      const contentType = columnContentTypes[cellIdx] ?? 'text';
                      return (
                        <td key={cellIdx} className={`sirius-data-table__cell--${contentType}`}>
                          {truncate && contentType === 'text' ? (
                            <span className="sirius-data-table__truncate-text">{cell}</span>
                          ) : (
                            cell
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {showTotalsInFooter && renderTotalsRow(true)}
            </tbody>
          </table>

          {selecting && (
            <div className="sirius-data-table__bulk">
              <SiriusBulkActions
                {...bulkActions}
                selectedCount={selectedCount}
                totalCount={selectableIds.length}
                onToggleAll={toggleAll}
              />
            </div>
          )}
        </div>

        {footerContent && (
          <div className="sirius-data-table__footer">
            <p className="sirius-data-table__footer-text">{footerContent}</p>
          </div>
        )}

        {pagination && <SiriusPagination type="table" {...pagination} />}
      </div>
    </div>
  );
}

export { SiriusDataTable as DataTable };
