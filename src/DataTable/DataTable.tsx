'use client';

import React, { useState } from 'react';
import { Icon } from '../Icon/Icon';
import './data-table.css';

export type ColumnContentType = 'text' | 'numeric';
export type SortDirection = 'ascending' | 'descending' | 'none';

export interface SiriusDataTablePagination {
  hasNext?: boolean;
  hasPrevious?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  label?: React.ReactNode;
}

export interface SiriusDataTableProps {
  /** Titre au-dessus du tableau (ex: "Sales by product") */
  title?: React.ReactNode;
  /** Type de contenu de chaque colonne ('text' aligné à gauche, 'numeric' aligné à droite) */
  columnContentTypes: ColumnContentType[];
  /** Libellés des en-têtes de colonnes */
  headings: React.ReactNode[];
  /** Lignes de données (tableau 2D de cellules) */
  rows: (React.ReactNode)[][];
  /** Ligne de totaux (tableau de valeurs pour chaque colonne) */
  totals?: (React.ReactNode)[];
  /** Libellé personnalisé pour la cellule de totaux (défaut: "Totals") */
  totalsName?: { singular: string; plural: string } | string;
  /** Place la ligne des totaux en bas du tableau plutôt qu'en haut */
  showTotalsInFooter?: boolean;
  /** Tableau de booléens indiquant si chaque colonne est triable */
  sortable?: boolean[];
  /** Direction de tri par défaut */
  defaultSortDirection?: SortDirection;
  /** Index de la colonne triée initialement */
  initialSortColumnIndex?: number;
  /** Callback déclenché lors d'un clic de tri */
  onSort?: (columnIndex: number, direction: SortDirection) => void;
  /** Message d'information en pied de tableau (ex: "Showing 3 of 3 results") */
  footerContent?: React.ReactNode;
  /** Réduit la hauteur des lignes pour une densité de données accrue */
  increasedTableDensity?: boolean;
  /** Active l'alternance de couleur de fond sur les lignes (rayures zébrées) */
  hasZebraStriping?: boolean;
  /** Fige l'en-tête de colonnes lors du défilement vertical */
  stickyHeader?: boolean;
  /** Hauteur maximale du conteneur lors de l'utilisation du sticky header */
  maxHeight?: string | number;
  /** Fige la première colonne lors du défilement horizontal */
  fixedFirstColumns?: number;
  /** Pagination centrée [ < | > ] en pied de tableau */
  pagination?: SiriusDataTablePagination;
  /** Active le survol interactif des lignes */
  hoverable?: boolean;
  /** Troncature automatique des cellules avec ellipse */
  truncate?: boolean;
  /** Classes CSS supplémentaires */
  className?: string;
  /** Styles inline */
  style?: React.CSSProperties;
}

export function SiriusDataTable({
  title,
  columnContentTypes,
  headings,
  rows,
  totals,
  totalsName = 'Totals',
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
}: SiriusDataTableProps) {
  const [sortedIndex, setSortedIndex] = useState<number | undefined>(initialSortColumnIndex);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);

  const handleSort = (index: number) => {
    let nextDirection: SortDirection = 'ascending';
    if (sortedIndex === index) {
      nextDirection = sortDirection === 'ascending' ? 'descending' : 'ascending';
    }
    setSortedIndex(index);
    setSortDirection(nextDirection);
    if (onSort) {
      onSort(index, nextDirection);
    }
  };

  const totalsLabel =
    typeof totalsName === 'string'
      ? totalsName
      : totalsName?.singular ?? 'Totals';

  // Rendu d'une cellule de totaux
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
        {totals.map((totalValue, idx) => {
          const contentType = columnContentTypes[idx] ?? 'text';
          const isFirst = idx === 0;
          return (
            <td
              key={`total-${idx}`}
              className={`sirius-data-table__cell--${contentType}`}
            >
              {isFirst ? (totalValue || totalsLabel) : totalValue}
            </td>
          );
        })}
      </tr>
    );
  };

  return (
    <div className={['sirius-data-table-wrapper', className].filter(Boolean).join(' ')} style={style}>
      {/* Titre optionnel au-dessus du tableau (standard Polaris) */}
      {title && <h2 className="sirius-data-table__title">{title}</h2>}

      {/* Carte conteneur avec bordure et coins arrondis */}
      <div className="sirius-data-table-card">
        <div
          className="sirius-data-table__scroll-container"
          style={{ maxHeight: maxHeight ? maxHeight : undefined }}
        >
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
            role="table"
          >
            <thead>
              <tr>
                {headings.map((heading, idx) => {
                  const contentType = columnContentTypes[idx] ?? 'text';
                  const isColSortable = Boolean(sortable && sortable[idx]);
                  const isCurrentlySorted = sortedIndex === idx;

                  const sortAria = isColSortable
                    ? isCurrentlySorted
                      ? sortDirection === 'ascending'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                    : undefined;

                  return (
                    <th
                      key={idx}
                      scope="col"
                      className={[
                        `sirius-data-table__cell--${contentType}`,
                        isColSortable && 'sirius-data-table__heading--sortable',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      aria-sort={sortAria as any}
                      onClick={isColSortable ? () => handleSort(idx) : undefined}
                    >
                      <span className="sirius-data-table__heading-inner">
                        {isColSortable && (
                          <span
                            className={[
                              'sirius-data-table__sort-icon',
                              isCurrentlySorted && 'sirius-data-table__sort-icon--active',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          >
                            {isCurrentlySorted ? (
                              <Icon
                                name={sortDirection === 'ascending' ? 'chevron-up' : 'chevron-down'}
                                size={13}
                              />
                            ) : (
                              <Icon name="sort" size={13} />
                            )}
                          </span>
                        )}
                        <span>{heading}</span>
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {/* Totaux en haut (comportement par défaut Polaris) */}
              {!showTotalsInFooter && renderTotalsRow(false)}

              {/* Lignes de données */}
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((cell, cellIdx) => {
                    const contentType = columnContentTypes[cellIdx] ?? 'text';
                    return (
                      <td
                        key={cellIdx}
                        className={[
                          `sirius-data-table__cell--${contentType}`,
                          truncate && contentType === 'text' && 'sirius-data-table__truncate',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Totaux en bas (si showTotalsInFooter est actif) */}
              {showTotalsInFooter && renderTotalsRow(true)}
            </tbody>
          </table>
        </div>

        {/* Pied de tableau : Message de comptage */}
        {footerContent && (
          <div className="sirius-data-table__footer">
            <p className="sirius-data-table__footer-text">{footerContent}</p>
          </div>
        )}

        {/* Pied de tableau : Contrôle de pagination segmenté */}
        {pagination && (
          <div className="sirius-data-table__pagination">
            <div className="sirius-data-table__pagination-group" role="navigation" aria-label="Pagination">
              <button
                type="button"
                className="sirius-data-table__pagination-btn"
                disabled={!pagination.hasPrevious}
                onClick={pagination.onPrevious}
                aria-label="Page précédente"
              >
                <Icon name="chevron-left" size={14} />
              </button>
              <button
                type="button"
                className="sirius-data-table__pagination-btn"
                disabled={!pagination.hasNext}
                onClick={pagination.onNext}
                aria-label="Page suivante"
              >
                <Icon name="chevron-right" size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { SiriusDataTable as DataTable };
