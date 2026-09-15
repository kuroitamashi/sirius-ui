'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import './autocomplete.css';

export interface AutocompleteOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface AutocompleteSection {
  title?: string;
  options: AutocompleteOption[];
}

export interface AutocompleteAction {
  content: string;
  helpText?: string;
  badge?: {
    content: string;
    status?: string;
  };
  destructive?: boolean;
  icon?: React.ReactNode;
  onAction: () => void;
}

export interface SiriusAutocompleteProps {
  /** Libellé affiché au-dessus du champ (ex: "Tags") */
  label?: React.ReactNode;
  /** Texte d'espace réservé (placeholder) */
  placeholder?: string;
  /** Valeur textuelle courante du champ de recherche */
  value?: string;
  /** Callback déclenché lors de la saisie */
  onChange?: (value: string) => void;
  /** Liste des valeurs sélectionnées */
  selected: string[];
  /** Callback déclenché lors de la sélection/désélection d'une ou plusieurs valeurs */
  onSelect: (selected: string[]) => void;
  /** Liste simple d'options */
  options?: AutocompleteOption[];
  /** Liste d'options groupées en sections avec titres */
  sections?: AutocompleteSection[];
  /** Autorise la sélection multiple (avec cases à cocher et tags amovibles) */
  allowMultiple?: boolean;
  /** Affiche un indicateur de chargement circulaire dans le popover */
  loading?: boolean;
  /** Élément ou message personnalisé lorsque la recherche ne produit aucun résultat */
  emptyState?: React.ReactNode;
  /** Action spéciale affichée en tête de liste dans le popover */
  actionBefore?: AutocompleteAction;
  /** Action spéciale affichée en pied de liste dans le popover */
  actionAfter?: AutocompleteAction;
  /** Classes CSS personnalisées */
  className?: string;
  /** Styles en ligne */
  style?: React.CSSProperties;
}

export const SiriusAutocomplete: React.FC<SiriusAutocompleteProps> = ({
  label,
  placeholder = 'Search',
  value = '',
  onChange,
  selected = [],
  onSelect,
  options,
  sections,
  allowMultiple = false,
  loading = false,
  emptyState,
  actionBefore,
  actionAfter,
  className,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Normalisation des sections
  const normalizedSections = useMemo<AutocompleteSection[]>(() => {
    if (sections && sections.length > 0) {
      return sections;
    }
    if (options && options.length > 0) {
      return [{ options }];
    }
    return [];
  }, [sections, options]);

  // Filtrage des options selon la recherche
  const filteredSections = useMemo<AutocompleteSection[]>(() => {
    const query = (value || '').toLowerCase().trim();
    if (!query) {
      return normalizedSections;
    }

    return normalizedSections
      .map((section) => ({
        ...section,
        options: section.options.filter((opt) =>
          opt.label.toLowerCase().includes(query)
        ),
      }))
      .filter((section) => section.options.length > 0);
  }, [normalizedSections, value]);

  const totalFilteredOptionsCount = useMemo(() => {
    return filteredSections.reduce((acc, sec) => acc + sec.options.length, 0);
  }, [filteredSections]);

  // Fermeture lors du clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    if (onChange) {
      onChange(newVal);
    }
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleSelectOption = (option: AutocompleteOption) => {
    if (option.disabled) return;

    if (allowMultiple) {
      const isAlreadySelected = selected.includes(option.value);
      const newSelected = isAlreadySelected
        ? selected.filter((v) => v !== option.value)
        : [...selected, option.value];
      onSelect(newSelected);
      // Garder le popover ouvert en multi-sélection
    } else {
      onSelect([option.value]);
      if (onChange) {
        onChange(option.label);
      }
      setIsOpen(false);
    }
  };

  const handleRemoveTag = (valToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(selected.filter((v) => v !== valToRemove));
  };

  // Trouver le libellé associé à une valeur sélectionnée pour les tags
  const getOptionLabel = useCallback(
    (val: string) => {
      for (const sec of normalizedSections) {
        const found = sec.options.find((opt) => opt.value === val);
        if (found) return found.label;
      }
      return val;
    },
    [normalizedSections]
  );

  const renderAction = (action: AutocompleteAction) => {
    const isDestructive = Boolean(action.destructive);

    return (
      <div
        className={[
          'sirius-autocomplete__action',
          isDestructive && 'sirius-autocomplete__action--destructive',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => {
          action.onAction();
          setIsOpen(false);
        }}
      >
        <div className="sirius-autocomplete__action-icon">
          {action.icon ? (
            action.icon
          ) : isDestructive ? (
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M14 4h3a1 1 0 010 2h-1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 010-2h3V3a2 2 0 012-2h4a2 2 0 012 2v1zm-6-1h4v1H8V3zm6 3H6v10h8V6z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 7h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 112 0v3z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div className="sirius-autocomplete__action-content">
          <div className="sirius-autocomplete__action-title">{action.content}</div>
          {action.helpText && (
            <div className="sirius-autocomplete__action-help">{action.helpText}</div>
          )}
        </div>
        {action.badge && (
          <div className="sirius-autocomplete__action-badge">
            {action.badge.content}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={['sirius-autocomplete', className].filter(Boolean).join(' ')}
      style={style}
    >
      {/* Libellé au-dessus du champ */}
      {label && <label className="sirius-autocomplete__label">{label}</label>}

      {/* Champ de recherche avec icône loupe et tags */}
      <div
        className={[
          'sirius-autocomplete__input-wrapper',
          isOpen && 'sirius-autocomplete__input-wrapper--focused',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        {/* Icône loupe */}
        <svg
          viewBox="0 0 20 20"
          className="sirius-autocomplete__search-icon"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>

        {/* Tags sélectionnés en mode multi-sélection */}
        {allowMultiple && selected.length > 0 && (
          <div className="sirius-autocomplete__tags-list">
            {selected.map((val) => (
              <span key={val} className="sirius-autocomplete__tag">
                {getOptionLabel(val)}
                <button
                  type="button"
                  className="sirius-autocomplete__tag-remove"
                  onClick={(e) => handleRemoveTag(val, e)}
                  aria-label={`Supprimer ${getOptionLabel(val)}`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Champ texte */}
        <input
          ref={inputRef}
          type="text"
          className="sirius-autocomplete__input"
          placeholder={allowMultiple && selected.length > 0 ? '' : placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
        />
      </div>

      {/* Popover déroulant */}
      {isOpen && (
        <div className="sirius-autocomplete__popover" role="listbox">
          {/* Action en tête */}
          {actionBefore && renderAction(actionBefore)}

          {/* État de chargement */}
          {loading ? (
            <div className="sirius-autocomplete__loading">
              <div className="sirius-autocomplete__spinner" />
            </div>
          ) : totalFilteredOptionsCount === 0 ? (
            /* État vide */
            <div className="sirius-autocomplete__empty">
              {emptyState || 'No options found'}
            </div>
          ) : (
            /* Liste des options filtrées */
            filteredSections.map((sec, secIdx) => (
              <div key={secIdx} className="sirius-autocomplete__section">
                {sec.title && (
                  <div className="sirius-autocomplete__section-title">
                    {sec.title}
                  </div>
                )}
                {sec.options.map((opt) => {
                  const isOptSelected = selected.includes(opt.value);

                  return (
                    <div
                      key={opt.value}
                      className={[
                        'sirius-autocomplete__option',
                        isOptSelected && 'sirius-autocomplete__option--selected',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => handleSelectOption(opt)}
                      role="option"
                      aria-selected={isOptSelected}
                    >
                      <div className="sirius-autocomplete__option-left">
                        {allowMultiple && (
                          <span
                            className={[
                              'sirius-autocomplete__checkbox',
                              isOptSelected &&
                                'sirius-autocomplete__checkbox--checked',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          >
                            {isOptSelected && '✓'}
                          </span>
                        )}
                        <span>{opt.label}</span>
                      </div>

                      {/* Coche pour sélection simple */}
                      {!allowMultiple && isOptSelected && (
                        <svg
                          viewBox="0 0 20 20"
                          className="sirius-autocomplete__checkmark"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}

          {/* Action en pied */}
          {actionAfter && renderAction(actionAfter)}
        </div>
      )}
    </div>
  );
};

export default SiriusAutocomplete;
