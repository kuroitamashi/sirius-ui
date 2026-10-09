'use client';

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Icon } from '../Icon/Icon';
import './filters.css';

export interface SiriusFilterChoice {
  value: string;
  label: string;
}

export interface SiriusFilterDescriptor {
  /** Identifiant unique, clé de `value` */
  key: string;
  /** Nom du filtre, dans la liste de suggestions et sur son étiquette */
  label: string;
  choices: SiriusFilterChoice[];
  /** Plusieurs valeurs à la fois (cases à cocher). Par défaut : oui */
  allowMultiple?: boolean;
  /** Propose « est » / « n'est pas » sous les valeurs */
  negatable?: boolean;
  disabled?: boolean;
}

export interface SiriusFilterValue {
  values: string[];
  /** « n'est pas » au lieu de « est » */
  negated?: boolean;
}

export type SiriusFiltersValue = Record<string, SiriusFilterValue>;

export interface SiriusFiltersProps {
  queryValue?: string;
  queryPlaceholder?: string;
  onQueryChange?: (value: string) => void;
  filters: SiriusFilterDescriptor[];
  /** Les filtres appliqués, par clé. Un filtre sans valeur n'y figure pas. */
  value: SiriusFiltersValue;
  onChange: (value: SiriusFiltersValue) => void;
  disabled?: boolean;
  /** Placé à droite du champ (menu de colonnes, tri…) */
  children?: React.ReactNode;
  className?: string;
}

/** Au-delà, l'étiquette résume : « Boubous, Robes, Wax + 2 de plus ». */
const VALEURS_VISIBLES = 3;

type Ligne =
  | { type: 'choix'; choix: SiriusFilterChoice }
  | { type: 'operateur'; negated: boolean; label: string };

/**
 * Barre de recherche et de filtres d'une liste (produits, commandes, clientes).
 * Cliquer dans le champ propose les filtres ; flèches et Entrée pour choisir.
 * Un filtre choisi devient une étiquette dans le champ : son nom en gris, ses
 * valeurs en bleu. Sa fenêtre liste les valeurs, puis « est » / « n'est pas ».
 */
export function SiriusFilters({
  queryValue = '',
  queryPlaceholder = 'Rechercher',
  onQueryChange,
  filters,
  value,
  onChange,
  disabled = false,
  children,
  className = '',
}: SiriusFiltersProps) {
  const id = useId();
  const racine = useRef<HTMLDivElement>(null);
  const champ = useRef<HTMLInputElement>(null);
  const liste = useRef<HTMLUListElement>(null);
  const etiquettes = useRef<Record<string, HTMLButtonElement | null>>({});
  const [suggestions, setSuggestions] = useState(false);
  const [actif, setActif] = useState(0);
  // Le filtre dont la fenêtre est ouverte. Pendant ce temps, le texte tapé
  // cherche parmi ses valeurs et ne touche pas à la recherche de la liste.
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [rechercheValeur, setRechercheValeur] = useState('');
  const [gauche, setGauche] = useState(0);

  const filtreOuvert = filters.find(f => f.key === ouvert);
  // Dans l'ordre où on les a ajoutées, pas dans celui de la liste.
  const appliques = Object.keys(value).map(k => filters.find(f => f.key === k)).filter((f): f is SiriusFilterDescriptor => Boolean(f && value[f.key].values.length));
  const etiquetees = filtreOuvert && !value[filtreOuvert.key] ? [...appliques, filtreOuvert] : appliques;

  const texte = filtreOuvert ? rechercheValeur : queryValue;
  const q = texte.trim().toLowerCase();

  const lignes: Ligne[] = filtreOuvert
    ? [
        ...filtreOuvert.choices.filter(c => c.label.toLowerCase().includes(q)).map(choix => ({ type: 'choix' as const, choix })),
        ...(filtreOuvert.negatable
          ? [{ type: 'operateur' as const, negated: false, label: 'est' }, { type: 'operateur' as const, negated: true, label: "n'est pas" }]
          : []),
      ]
    : [];
  const proposes = filters.filter(f => !f.disabled && !value[f.key] && f.label.toLowerCase().includes(q));
  const listeOuverte = !disabled && (filtreOuvert ? lignes.length > 0 : suggestions && proposes.length > 0);
  const total = filtreOuvert ? lignes.length : proposes.length;
  const actifBorne = Math.min(actif, total - 1);

  useEffect(() => {
    const fermer = (e: MouseEvent) => {
      if (racine.current?.contains(e.target as Node)) return;
      setSuggestions(false);
      setOuvert(null);
    };
    document.addEventListener('mousedown', fermer);
    return () => document.removeEventListener('mousedown', fermer);
  }, []);

  useEffect(() => {
    liste.current?.querySelectorAll('[role=option]')[actifBorne]?.scrollIntoView({ block: 'nearest' });
  }, [actifBorne, ouvert]);

  // La fenêtre d'un filtre s'aligne sous son étiquette. Elle vit hors du
  // cadre du champ, qui coupe ce qui dépasse (overflow: hidden).
  useLayoutEffect(() => {
    if (!ouvert) return;
    const e = etiquettes.current[ouvert];
    const r = racine.current?.querySelector('.sirius-filters__recherche');
    if (e && r) setGauche(e.getBoundingClientRect().left - r.getBoundingClientRect().left);
  }, [ouvert, value]);

  const ouvrir = (k: string) => {
    setOuvert(k);
    setRechercheValeur('');
    setSuggestions(false);
    setActif(0);
    champ.current?.focus();
  };

  // Le texte tapé servait à trouver le filtre : il ne cherche pas de produit.
  const choisirFiltre = (k: string) => { if (queryValue) onQueryChange?.(''); ouvrir(k); };

  const fermerFenetre = () => { setOuvert(null); setRechercheValeur(''); setActif(0); };

  const basculerChoix = (f: SiriusFilterDescriptor, v: string) => {
    const actuel = value[f.key] ?? { values: [] };
    const values = f.allowMultiple === false
      ? (actuel.values.includes(v) ? [] : [v])
      : actuel.values.includes(v) ? actuel.values.filter(x => x !== v) : [...actuel.values, v];
    const { [f.key]: _, ...reste } = value;
    onChange(values.length ? { ...value, [f.key]: { ...actuel, values } } : reste);
  };

  const choisirOperateur = (f: SiriusFilterDescriptor, negated: boolean) => {
    // Sans valeur, l'opérateur n'a rien à porter : on le gardera au premier choix.
    if (value[f.key]) onChange({ ...value, [f.key]: { ...value[f.key], negated } });
  };

  const activer = (i: number) => {
    if (filtreOuvert) {
      const l = lignes[i];
      if (l.type === 'choix') basculerChoix(filtreOuvert, l.choix.value);
      else choisirOperateur(filtreOuvert, l.negated);
    } else {
      choisirFiltre(proposes[i].key);
    }
  };

  const clavier = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (filtreOuvert) fermerFenetre(); else setSuggestions(false);
      return;
    }
    // Effacer dans un champ vide retire la dernière étiquette.
    if (e.key === 'Backspace' && texte === '' && !filtreOuvert && appliques.length) {
      const { [appliques[appliques.length - 1].key]: _, ...reste } = value;
      onChange(reste);
      return;
    }
    if (!listeOuverte) {
      if (e.key === 'ArrowDown') { setSuggestions(true); setActif(0); e.preventDefault(); }
      return;
    }
    if (e.key === 'ArrowDown') { setActif((actifBorne + 1) % total); e.preventDefault(); }
    if (e.key === 'ArrowUp') { setActif((actifBorne - 1 + total) % total); e.preventDefault(); }
    if (e.key === 'Enter') { activer(actifBorne); e.preventDefault(); }
  };

  const saisie = (v: string) => {
    if (filtreOuvert) setRechercheValeur(v);
    else { onQueryChange?.(v); setSuggestions(true); }
    setActif(0);
  };

  const toutEffacer = () => {
    onQueryChange?.('');
    onChange({});
    fermerFenetre();
    champ.current?.focus();
  };

  const optionId = (i: number) => `${id}-option-${i}`;
  const touche = <kbd className="sirius-filters__touche"><Icon name="return" size={14} />Entrée</kbd>;

  const resume = (f: SiriusFilterDescriptor) => {
    const v = value[f.key];
    if (!v) return null;
    const noms = v.values.map(x => f.choices.find(c => c.value === x)?.label ?? x);
    const plus = noms.length - VALEURS_VISIBLES;
    return noms.slice(0, VALEURS_VISIBLES).join(', ') + (plus > 0 ? ` + ${plus} de plus` : '');
  };

  return (
    <div ref={racine} className={`sirius-filters ${className}`.trim()}>
      <div className="sirius-filters__recherche">
        <div className={`sirius-input-box sirius-filters__cadre${disabled ? ' sirius-input-box--disabled' : ''}`}
          onMouseDown={e => { if (e.target === e.currentTarget) { e.preventDefault(); champ.current?.focus(); } }}>
          <div className="sirius-input__icon"><Icon name="search" size={20} /></div>
          <div className="sirius-filters__contenu">
            {etiquetees.map(f => {
              const v = value[f.key];
              const valeurs = resume(f);
              return (
                <button
                  key={f.key}
                  ref={e => { etiquettes.current[f.key] = e; }}
                  type="button"
                  tabIndex={-1}
                  disabled={disabled}
                  className={`sirius-filters__etiquette${ouvert === f.key ? ' sirius-filters__etiquette--ouverte' : ''}`}
                  aria-expanded={ouvert === f.key}
                  onMouseDown={e => { e.preventDefault(); if (ouvert === f.key) fermerFenetre(); else ouvrir(f.key); }}
                >
                  <span className="sirius-filters__etiquette-nom">{f.label} {v?.negated ? "n'est pas" : 'est'}</span>
                  {valeurs && <span className="sirius-filters__etiquette-valeurs">{valeurs}</span>}
                </button>
              );
            })}
            <input
              ref={champ}
              type="text"
              className="sirius-input sirius-filters__champ"
              aria-label={queryPlaceholder}
              placeholder={filtreOuvert ? `Rechercher dans ${filtreOuvert.label.toLowerCase()}` : etiquetees.length ? '' : queryPlaceholder}
              value={texte}
              disabled={disabled}
              autoComplete="off"
              role="combobox"
              aria-expanded={listeOuverte}
              aria-controls={`${id}-liste`}
              aria-activedescendant={listeOuverte ? optionId(actifBorne) : undefined}
              onChange={e => saisie(e.target.value)}
              onFocus={() => { if (!ouvert) { setSuggestions(true); setActif(0); } }}
              onClick={() => { if (!ouvert) setSuggestions(true); }}
              onKeyDown={clavier}
            />
          </div>
          {(queryValue || appliques.length > 0) && !disabled && (
            <button type="button" className="sirius-filters__vider" aria-label="Effacer la recherche et les filtres"
              onMouseDown={e => e.preventDefault()} onClick={toutEffacer}>
              <Icon name="x" size={16} />
            </button>
          )}
        </div>

        {listeOuverte && (
          <ul
            ref={liste}
            id={`${id}-liste`}
            role="listbox"
            aria-label={filtreOuvert ? filtreOuvert.label : 'Filtres'}
            aria-multiselectable={filtreOuvert ? filtreOuvert.allowMultiple !== false : undefined}
            className="sirius-filters__liste"
            style={filtreOuvert ? { left: gauche } : undefined}
          >
            {filtreOuvert
              ? lignes.map((l, i) => {
                  const v = value[filtreOuvert.key];
                  const coche = l.type === 'choix'
                    ? Boolean(v?.values.includes(l.choix.value))
                    : Boolean(v?.negated) === l.negated;
                  const separe = l.type === 'operateur' && !l.negated && i > 0;
                  return (
                    <React.Fragment key={l.type === 'choix' ? l.choix.value : l.label}>
                      {separe && <li role="separator" className="sirius-filters__separateur" />}
                      <li
                        id={optionId(i)}
                        role="option"
                        aria-selected={coche}
                        className={`sirius-filters__ligne${i === actifBorne ? ' sirius-filters__ligne--active' : ''}`}
                        onMouseEnter={() => setActif(i)}
                        onMouseDown={e => { e.preventDefault(); activer(i); }}
                      >
                        {l.type === 'choix' ? (
                          <span className={`sirius-checkbox${coche ? ' sirius-checkbox--checked' : ''}`} aria-hidden="true">
                            {coche && <Icon name="check" size={12} />}
                          </span>
                        ) : (
                          <span className="sirius-filters__coche" aria-hidden="true">{coche && <Icon name="check" size={16} />}</span>
                        )}
                        <span className="sirius-filters__ligne-texte">{l.type === 'choix' ? l.choix.label : l.label}</span>
                        {i === actifBorne && touche}
                      </li>
                    </React.Fragment>
                  );
                })
              : proposes.map((f, i) => (
                  <li
                    key={f.key}
                    id={optionId(i)}
                    role="option"
                    aria-selected={i === actifBorne}
                    className={`sirius-filters__ligne${i === actifBorne ? ' sirius-filters__ligne--active' : ''}`}
                    onMouseEnter={() => setActif(i)}
                    // mousedown : choisir avant que le champ ne perde le focus
                    onMouseDown={e => { e.preventDefault(); choisirFiltre(f.key); }}
                  >
                    <span className="sirius-filters__ligne-texte">{f.label}</span>
                    {i === actifBorne && touche}
                  </li>
                ))}
          </ul>
        )}
      </div>
      {children}
    </div>
  );
}
