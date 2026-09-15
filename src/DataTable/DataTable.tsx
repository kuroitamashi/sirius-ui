import React, { useState } from 'react';
import { Icon } from '../Icon/Icon';
import { SiriusPagination } from '../Pagination';
import type { SiriusPaginationProps } from '../Pagination';
import './data-table.css';

export type ColumnContentType = 'text' | 'numeric';
export type SortDirection = 'ascending' | 'descending' | 'none';

export type SiriusDataTablePagination = SiriusPaginationProps;


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

/**
 * Icône de tri officielle Polaris pour les colonnes DataTable :
 * Deux chevrons empilés (haut et bas).
 * - En tri ascendant : le chevron du haut est noir (#202223), le chevron du bas est gris clair (#c4cdd5).
 * - En tri descendant : le chevron du bas est noir (#202223), le chevron du haut est gris clair (#c4cdd5).
 * - Si colonne non activement triée : les deux chevrons sont en gris clair (#c4cdd5).
 */
export function DataTableSortIcon({
  direction,
  isSorted = false,
}: {
  direction?: SortDirection;
  isSorted?: boolean;
}) {
  const isUpActive = isSorted && direction === 'ascending';
  const isDownActive = isSorted && direction === 'descending';

  const upColor = isUpActive ? '#202223' : '#c4cdd5';
  const downColor = isDownActive ? '#202223' : '#c4cdd5';

  return (
    <svg
      width="10"
      height="14"
      viewBox="0 0 10 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="sirius-data-table__sort-icon"
      aria-hidden="true"
    >
      <path
        d="M2 5L5 2L8 5"
        stroke={upColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 9L5 12L8 9"
        stroke={downColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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
      <div


        className={[
          'sirius-data-table-card',
          stickyHeader && 'sirius-data-table-card--sticky',
        ]
          .filter(Boolean)
          .join(' ')}
      >
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
                          <DataTableSortIcon
                            direction={sortDirection}
                            isSorted={isCurrentlySorted}
                          />
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
              {rows.map((row, rowIdx) => {
                // Alternance zébrée : la première ligne de données (rowIdx === 0) juste sous
                // l'en-tête ou les totaux reste BLANCHE. Les lignes impaires (1, 3, 5...) sont
                // grisées pour éviter 2 lignes grises consécutives avec la ligne des totaux.
                const isZebraRow = hasZebraStriping && rowIdx % 2 === 1;

                return (
                  <tr
                    key={rowIdx}
                    className={
                      isZebraRow
                        ? 'sirius-data-table__row--zebra-striped'
                        : undefined
                    }
                  >
                    {row.map((cell, cellIdx) => {
                      const contentType = columnContentTypes[cellIdx] ?? 'text';
                      const isTruncated = truncate && contentType === 'text';
                      return (
                        <td
                          key={cellIdx}
                          className={`sirius-data-table__cell--${contentType}`}
                        >
                          {isTruncated ? (
                            <span className="sirius-data-table__truncate-text">
                              {cell}
                            </span>
                          ) : (
                            cell
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Totaux en bas (si showTotalsInFooter est actif) */}
              {showTotalsInFooter && renderTotalsRow(true)}
            </tbody>
          </table>
        </div>

        {/* Pied de tableau : Message de comptage */}
        {footerContent && (
          <div
            className={[
              'sirius-data-table__footer',
              hasZebraStriping && 'sirius-data-table__footer--white',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <p className="sirius-data-table__footer-text">{footerContent}</p>
          </div>
        )}

        {/* Pied de tableau : Contrôle de pagination Sirius */}
        {pagination && (
          <SiriusPagination
            type="table"
            {...pagination}
          />
        )}
      </div>
    </div>
  );
}

export { SiriusDataTable as DataTable };
