'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '../Icon/Icon';
import { SearchField } from '../Form/SearchField';
import './filters.css';

export interface SiriusFilterDescriptor {
  /** Identifiant unique, repris par appliedFilters */
  key: string;
  /** Nom du filtre dans la liste de suggestions et sur sa pastille vide */
  label: string;
  /** Contenu de la fenêtre de la pastille (souvent un SiriusChoiceList) */
  filter: React.ReactNode;
  /** Pastille toujours affichée, même sans valeur */
  pinned?: boolean;
  disabled?: boolean;
}

export interface SiriusAppliedFilter {
  key: string;
  /** Résumé affiché sur la pastille, ex. « Collection : Robes, Boubous » */
  label: string;
  onRemove: (key: string) => void;
}

export interface SiriusFiltersProps {
  queryValue?: string;
  queryPlaceholder?: string;
  onQueryChange?: (value: string) => void;
  onQueryClear?: () => void;
  filters: SiriusFilterDescriptor[];
  appliedFilters?: SiriusAppliedFilter[];
  /** Affiche « Tout effacer » quand au moins un filtre est appliqué */
  onClearAll?: () => void;
  disabled?: boolean;
  /** Masque le champ de recherche : il ne reste que les pastilles */
  hideQueryField?: boolean;
  /** Placé à droite du champ (menu de colonnes, tri…) */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Barre de recherche et de filtres d'une liste (produits, commandes, clientes).
 * Cliquer dans le champ propose les filtres ; flèches et Entrée pour choisir.
 * Un filtre choisi devient une pastille sous le champ, qui ouvre son contenu.
 */
export function SiriusFilters({
  queryValue = '',
  queryPlaceholder = 'Rechercher',
  onQueryChange,
  onQueryClear,
  filters,
  appliedFilters = [],
  onClearAll,
  disabled = false,
  hideQueryField = false,
  children,
  className = '',
}: SiriusFiltersProps) {
  const id = useId();
  const racine = useRef<HTMLDivElement>(null);
  const liste = useRef<HTMLUListElement>(null);
  const [suggestions, setSuggestions] = useState(false);
  const [actif, setActif] = useState(0);
  // La pastille dont la fenêtre est ouverte, et celle choisie dans la liste
  // mais encore sans valeur : elle disparaît si on referme sans rien cocher.
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [enAttente, setEnAttente] = useState<string | null>(null);

  const applique = (k: string) => appliedFilters.find(a => a.key === k);
  const q = queryValue.trim().toLowerCase();
  const proposes = filters.filter(f => !f.disabled && !applique(f.key) && f.label.toLowerCase().includes(q));
  const listeOuverte = suggestions && !disabled && proposes.length > 0;
  const pastilles = filters.filter(f => f.pinned || applique(f.key) || f.key === enAttente);

  useEffect(() => {
    const fermer = (e: MouseEvent) => {
      if (racine.current?.contains(e.target as Node)) return;
      setSuggestions(false);
      setOuvert(null);
      setEnAttente(null);
    };
    document.addEventListener('mousedown', fermer);
    return () => document.removeEventListener('mousedown', fermer);
  }, []);

  useEffect(() => {
    liste.current?.children[actif]?.scrollIntoView({ block: 'nearest' });
  }, [actif]);

  const choisir = (f: SiriusFilterDescriptor) => {
    setSuggestions(false);
    setEnAttente(f.key);
    setOuvert(f.key);
  };

  const basculer = (k: string) => {
    if (ouvert === k) { setOuvert(null); setEnAttente(null); return; }
    setOuvert(k);
    setSuggestions(false);
  };

  const clavier = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { setSuggestions(false); return; }
    if (!listeOuverte) {
      if (e.key === 'ArrowDown') { setSuggestions(true); setActif(0); e.preventDefault(); }
      return;
    }
    if (e.key === 'ArrowDown') { setActif(i => (i + 1) % proposes.length); e.preventDefault(); }
    if (e.key === 'ArrowUp') { setActif(i => (i - 1 + proposes.length) % proposes.length); e.preventDefault(); }
    if (e.key === 'Enter') { choisir(proposes[Math.min(actif, proposes.length - 1)]); e.preventDefault(); }
  };

  const optionId = (k: string) => `${id}-option-${k}`;
  const actifBorne = Math.min(actif, proposes.length - 1);

  return (
    <div ref={racine} className={`sirius-filters ${className}`.trim()}>
      {!hideQueryField && (
        <div className="sirius-filters__barre">
          <div className="sirius-filters__recherche">
            <SearchField
              aria-label={queryPlaceholder}
              placeholder={queryPlaceholder}
              value={queryValue}
              disabled={disabled}
              autoComplete="off"
              role="combobox"
              aria-expanded={listeOuverte}
              aria-controls={`${id}-liste`}
              aria-activedescendant={listeOuverte ? optionId(proposes[actifBorne].key) : undefined}
              onChange={e => { onQueryChange?.(e.target.value); setSuggestions(true); setActif(0); }}
              onClear={onQueryClear}
              onFocus={() => { setSuggestions(true); setActif(0); setOuvert(null); }}
              onClick={() => setSuggestions(true)}
              onKeyDown={clavier}
            />
            {listeOuverte && (
              <ul ref={liste} id={`${id}-liste`} role="listbox" aria-label="Filtres" className="sirius-filters__suggestions">
                {proposes.map((f, i) => (
                  <li
                    key={f.key}
                    id={optionId(f.key)}
                    role="option"
                    aria-selected={i === actifBorne}
                    className={`sirius-filters__suggestion${i === actifBorne ? ' sirius-filters__suggestion--actif' : ''}`}
                    onMouseEnter={() => setActif(i)}
                    // mousedown : choisir avant que le champ ne perde le focus
                    onMouseDown={e => { e.preventDefault(); choisir(f); }}
                  >
                    <span>{f.label}</span>
                    {i === actifBorne && (
                      <kbd className="sirius-filters__touche"><Icon name="return" size={14} />Entrée</kbd>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {children}
        </div>
      )}

      {(pastilles.length > 0 || appliedFilters.length > 0) && (
        <div className="sirius-filters__pastilles">
          {pastilles.map(f => {
            const a = applique(f.key);
            return (
              <div key={f.key} className="sirius-filters__pastille-wrap">
                <span className={`sirius-filters__pastille${a ? ' sirius-filters__pastille--appliquee' : ''}`}>
                  <button
                    type="button"
                    className="sirius-filters__pastille-bouton"
                    disabled={disabled || f.disabled}
                    aria-expanded={ouvert === f.key}
                    onClick={() => basculer(f.key)}
                  >
                    {a ? a.label : f.label}
                    {!a && <Icon name="chevron-down" size={16} />}
                  </button>
                  {a && (
                    <button
                      type="button"
                      className="sirius-filters__pastille-retirer"
                      aria-label={`Retirer le filtre ${f.label}`}
                      disabled={disabled}
                      onClick={() => { a.onRemove(f.key); setOuvert(null); setEnAttente(null); }}
                    >
                      <Icon name="x" size={16} />
                    </button>
                  )}
                </span>
                {ouvert === f.key && (
                  <div className="sirius-filters__fenetre" role="dialog" aria-label={f.label}>
                    {f.filter}
                    {a && (
                      <button type="button" className="sirius-filters__effacer"
                        onClick={() => { a.onRemove(f.key); setOuvert(null); setEnAttente(null); }}>
                        Effacer
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {onClearAll && appliedFilters.length > 0 && (
            <button type="button" className="sirius-filters__effacer" disabled={disabled}
              onClick={() => { onClearAll(); setOuvert(null); setEnAttente(null); }}>
              Tout effacer
            </button>
          )}
        </div>
      )}
    </div>
  );
}
