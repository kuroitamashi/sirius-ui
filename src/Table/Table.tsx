'use client';

import React from 'react';
import { Icon } from '../Icon/Icon';
import './table.css';

export interface SiriusTableColumn<T = any> {
  key: string;
  title: React.ReactNode;
  numeric?: boolean;
  width?: string;
  render?: (row: T, index: number) => React.ReactNode;
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
  embedded?: boolean;
  className?: string;
  rowClassName?: (row: T, index: number) => string | undefined;
  style?: React.CSSProperties;
  onRowClick?: (row: T, index: number) => void;
}

/**
 * Tableau de données Sirius UI / Sirius
 * Reproduction 1:1 du composant Figma ❖ Table
 */
export function SiriusTable<T = any>({
  columns,
  data,
  pagination,
  emptyState,
  embedded = false,
  className = '',
  rowClassName,
  style,
  onRowClick,
}: SiriusTableProps<T>) {
  return (
    <div
      className={[
        'sirius-table-container',
        embedded && 'sirius-table-container--embedded',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      <div className="sirius-table-scroll">
        <table className="sirius-table">
          <thead>
            <tr className="sirius-table__header-row">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={[
                    'sirius-table__th',
                    col.numeric && 'sirius-table__th--numeric',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="sirius-table__empty-cell"
                >
                  {emptyState ?? 'Aucune donnée disponible'}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={[
                    'sirius-table__row',
                    onRowClick && 'sirius-table__row--clickable',
                    rowClassName?.(row, rowIdx),
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => onRowClick?.(row, rowIdx)}
                >
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
              ))
            )}
          </tbody>
        </table>
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
