'use client';

import React from 'react';
import { Icon } from '../Icon/Icon';
import { SiriusCheckbox } from '../Form/Checkbox';
import { SiriusBulkActions, type SiriusBulkActionsProps } from '../BulkActions/BulkActions';
import { SiriusSpinner } from '../Spinner/Spinner';
import './table.css';

export type SiriusTableSortDirection = 'ascending' | 'descending';
export type SiriusTableRowTone = 'subdued' | 'success' | 'warning' | 'critical';

export interface SiriusTableColumn<T = any> {
  key: string;
  title: React.ReactNode;
  numeric?: boolean;
  width?: string;
  render?: (row: T, index: number) => React.ReactNode;
  /** La colonne se trie au clic sur son en-tête. */
  sortable?: boolean;
}

export interface SiriusTablePagination {
  hasPrevious?: boolean;
  hasNext?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  label?: React.ReactNode;
}

export interface SiriusTableProps<T = any> {
  columns: SiriusTableColumn<T>[];
  data: T[];
  pagination?: SiriusTablePagination;
  emptyState?: React.ReactNode;
  /** @deprecated Le tableau n'a plus de carte autour depuis le 2026-10-09 ; sans effet. */
  embedded?: boolean;
  className?: string;
  rowClassName?: (row: T, index: number) => string | undefined;
  style?: React.CSSProperties;
  onRowClick?: (row: T, index: number) => void;

  /** Une case à cocher au début de chaque ligne. */
  selectable?: boolean;
  /** Identifiant stable d'une ligne. Défaut : `row.id`, sinon sa position. */
  getRowId?: (row: T, index: number) => string;
  /** Lignes cochées (contrôlé). Sans cette prop, le tableau garde sa sélection seul. */
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Barre posée sur l'en-tête dès qu'une ligne est cochée. */
  bulkActions?: Omit<SiriusBulkActionsProps, 'selectedCount' | 'totalCount' | 'onToggleAll'>;
  /** Fond teinté d'une ligne : grisée, réussie, à surveiller, en erreur. */
  rowTone?: (row: T, index: number) => SiriusTableRowTone | undefined;
  /** Ligne grisée, ni cochable ni cliquable. */
  isRowDisabled?: (row: T, index: number) => boolean;
  /** Bandeau « Chargement… » sous l'en-tête, lignes estompées. */
  loading?: boolean;
  loadingLabel?: string;
  /** Tri : colonne et sens courants, et ce qui se passe au clic. */
  sortColumn?: string;
  sortDirection?: SiriusTableSortDirection;
  onSort?: (key: string, direction: SiriusTableSortDirection) => void;
  /** Une ligne sur deux légèrement grisée. */
  zebra?: boolean;
}

/**
 * Tableau de ressources Sirius : liste de commandes, de clients, de produits.
 * Relevé du 2026-10-09 sur l'admin de référence : en-tête 36 px gris, lignes
 * de 33 px séparées d'un trait, survol #f7f7f7, ligne cochée #f1f1f1.
 */
export function SiriusTable<T = any>({
  columns,
  data,
  pagination,
  emptyState,
  className = '',
  rowClassName,
  style,
  onRowClick,
  selectable = false,
  getRowId = (row, i) => String((row as any)?.id ?? i),
  selectedIds,
  onSelectionChange,
  bulkActions,
  rowTone,
  isRowDisabled,
  loading = false,
  loadingLabel = 'Chargement…',
  sortColumn,
  sortDirection = 'descending',
  onSort,
  zebra = false,
}: SiriusTableProps<T>) {
  const [innerSelection, setInnerSelection] = React.useState<string[]>([]);
  const selection = selectedIds ?? innerSelection;
  const setSelection = (ids: string[]) => {
    if (selectedIds === undefined) setInnerSelection(ids);
    onSelectionChange?.(ids);
  };

  const ids = data.map((row, i) => getRowId(row, i));
  const selectableIds = ids.filter((_, i) => !isRowDisabled?.(data[i], i));
  const selectedCount = selection.filter((id) => selectableIds.includes(id)).length;
  const allState: boolean | 'indeterminate' =
    selectedCount === 0 ? false : selectedCount === selectableIds.length ? true : 'indeterminate';

  const toggle = (id: string) =>
    setSelection(selection.includes(id) ? selection.filter((x) => x !== id) : [...selection, id]);
  const toggleAll = (all: boolean) => setSelection(all ? selectableIds : []);

  const colCount = columns.length + (selectable ? 1 : 0);

  return (
    <div
      className={[
        'sirius-table-container',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      <div className="sirius-table-scroll">
        <table
          className={['sirius-table', zebra && 'sirius-table--zebra'].filter(Boolean).join(' ')}
          aria-busy={loading || undefined}
        >
          <thead className={selectable && selectedCount > 0 ? 'sirius-table__thead--selecting' : undefined}>
            <tr className="sirius-table__header-row">
              {selectable && (
                <th className="sirius-table__th sirius-table__th--checkbox">
                  <SiriusCheckbox
                    label="Tout sélectionner"
                    labelHidden
                    checked={allState}
                    disabled={selectableIds.length === 0}
                    onChange={() => toggleAll(allState !== true)}
                  />
                </th>
              )}
              {columns.map((col) => {
                const sorted = sortColumn === col.key;
                const next: SiriusTableSortDirection =
                  sorted && sortDirection === 'descending' ? 'ascending' : 'descending';
                return (
                  <th
                    key={col.key}
                    className={[
                      'sirius-table__th',
                      col.numeric && 'sirius-table__th--numeric',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={col.width ? { width: col.width } : undefined}
                    aria-sort={sorted ? sortDirection : undefined}
                  >
                    {col.sortable && onSort ? (
                      <button
                        type="button"
                        className={['sirius-table__sort', sorted && 'sirius-table__sort--active'].filter(Boolean).join(' ')}
                        onClick={() => onSort(col.key, next)}
                      >
                        {col.title}
                        <Icon name={sorted && sortDirection === 'ascending' ? 'arrow-up' : 'arrow-down'} size={16} />
                      </button>
                    ) : (
                      col.title
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr className="sirius-table__loading-row">
                <td colSpan={colCount}>
                  <SiriusSpinner size="small" accessibilityLabel={loadingLabel} />
                  <span>{loadingLabel}</span>
                </td>
              </tr>
            )}
            {data.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="sirius-table__empty-cell">
                  {emptyState ?? 'Aucune donnée disponible'}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => {
                const id = ids[rowIdx];
                const disabled = isRowDisabled?.(row, rowIdx) ?? false;
                const selected = selectable && selection.includes(id);
                const tone = rowTone?.(row, rowIdx);
                // Dès qu'une ligne est cochée, cliquer une ligne la coche au lieu de l'ouvrir.
                const selecting = selectable && selectedCount > 0;
                const clickable = !disabled && (selecting || !!onRowClick);
                return (
                  <tr
                    key={id}
                    className={[
                      'sirius-table__row',
                      clickable && 'sirius-table__row--clickable',
                      selected && 'sirius-table__row--selected',
                      disabled && 'sirius-table__row--disabled',
                      tone && `sirius-table__row--${tone}`,
                      rowClassName?.(row, rowIdx),
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-selected={selectable ? selected : undefined}
                    aria-disabled={disabled || undefined}
                    onClick={() => {
                      if (disabled) return;
                      if (selecting) toggle(id);
                      else onRowClick?.(row, rowIdx);
                    }}
                  >
                    {selectable && (
                      // La case ne doit jamais ouvrir la ligne.
                      <td className="sirius-table__td sirius-table__td--checkbox" onClick={(e) => e.stopPropagation()}>
                        <SiriusCheckbox
                          label="Sélectionner la ligne"
                          labelHidden
                          checked={selected}
                          disabled={disabled}
                          onChange={() => toggle(id)}
                        />
                      </td>
                    )}
                    {columns.map((col) => {
                      const cellValue = (row as any)[col.key];
                      const content = col.render ? col.render(row, rowIdx) : cellValue;

                      return (
                        <td
                          key={col.key}
                          className={[
                            'sirius-table__td',
                            col.numeric && 'sirius-table__td--numeric',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {selectable && selectedCount > 0 && (
          <div className="sirius-table__bulk">
            <SiriusBulkActions
              {...bulkActions}
              selectedCount={selectedCount}
              totalCount={selectableIds.length}
              onToggleAll={toggleAll}
            />
          </div>
        )}
      </div>

      {/* Pied de tableau avec pagination Sirius */}
      {pagination && (
        <div className="sirius-table__footer">
          <div className="sirius-table__pagination-controls">
            <button
              type="button"
              className="sirius-table__pagination-btn"
              disabled={pagination.hasPrevious === false}
              onClick={pagination.onPrevious}
              aria-label="Page précédente"
            >
              <Icon name="chevron-left" size={16} />
            </button>
            <div className="sirius-table__pagination-divider" />
            <button
              type="button"
              className="sirius-table__pagination-btn"
              disabled={pagination.hasNext === false}
              onClick={pagination.onNext}
              aria-label="Page suivante"
            >
              <Icon name="chevron-right" size={16} />
            </button>
          </div>

          {pagination.label && (
            <div className="sirius-table__pagination-label">
              {pagination.label}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SiriusTable;
