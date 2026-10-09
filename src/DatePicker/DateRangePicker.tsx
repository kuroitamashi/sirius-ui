'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '../Icon/Icon';
import { SiriusButton } from '../Button/Button';
import { SiriusSelect, type SiriusSelectOption } from '../Form/Select';
import {
  lastPeriod, toDatePeriod, previousCalendarPeriod, last12Months, maskTime, finishTime, formatDateLong, parseDateFr,
  recentBlackFridays, recentFestivals, recentQuarters, resolvePreset, type Period, type NamedPeriod,
} from './periods';
import './date-picker.css';

// Calqué sur le sélecteur de période de l'accueil de l'admin de référence :
// menu à gauche (avec sous-menus « Derniers », « Période à ce jour »,
// « Trimestres »), champs de date toujours en haut, deux mois côte à côte,
// Annuler / Appliquer en bas. fromTime / toTime : heure de début (le premier
// jour) et de fin (le dernier jour). Sans elles, journées entières.
export type RangeValue = Period & { label: string; fromTime?: string; toTime?: string };

export interface SiriusDateRangePickerProps {
  /** Texte du bouton. Par défaut, le libellé de la période appliquée. */
  label?: string;
  /** Raccourci choisi à l'ouverture de la page (« 30j », « mois », « hier »…). */
  initialPreset?: string;
  /** Appelé au clic sur « Appliquer », avec la période et son libellé. */
  onApply: (value: RangeValue) => void;
  /** `plain` : bouton en texte nu, le fond n'apparaît qu'au survol. */
  variant?: 'default' | 'plain';
  /** Côté où s'aligne le panneau, sous le bouton. */
  align?: 'left' | 'right';
  className?: string;
}

// Un raccourci ne fait que remplir le brouillon ; toucher aux dates, au
// calendrier ou aux heures le transforme en plage personnalisée.
type Draft = { key: string; from: string; to: string; hours: boolean; fromTime: string; toTime: string };
type Preset = Period & { label: string; fromTime?: string; toTime?: string };

const hhmm = (d: Date) => d.toISOString().slice(11, 16);
const isoDay = (d: Date) => d.toISOString().slice(0, 10);
// Fenêtre glissante qui finit maintenant : 30 minutes, 12 heures.
function sinceNow(ms: number, label: string): Preset {
  const now = new Date(); const start = new Date(now.getTime() - ms);
  return { from: isoDay(start), to: isoDay(now), fromTime: hhmm(start), toTime: hhmm(now), label };
}

const PRESETS: Record<string, () => Preset> = {
  aujourdhui: () => ({ ...resolvePreset('aujourdhui'), label: "Aujourd'hui" }),
  hier: () => ({ ...resolvePreset('hier'), label: 'Hier' }),
  '30min': () => sinceNow(30 * 60_000, '30 dernières minutes'),
  '12h': () => sinceNow(12 * 3_600_000, '12 dernières heures'),
  '7j': () => ({ ...lastPeriod(7, 'jours', true), label: '7 derniers jours' }),
  '30j': () => ({ ...lastPeriod(30, 'jours', true), label: '30 derniers jours' }),
  '90j': () => ({ ...lastPeriod(90, 'jours', true), label: '90 derniers jours' }),
  '365j': () => ({ ...lastPeriod(365, 'jours', true), label: '365 derniers jours' }),
  semaine_derniere: () => ({ ...previousCalendarPeriod('semaine'), label: 'Semaine dernière' }),
  mois_dernier: () => ({ ...previousCalendarPeriod('mois'), label: 'Mois dernier' }),
  trimestre_dernier: () => ({ ...previousCalendarPeriod('trimestre'), label: 'Trimestre dernier' }),
  '12m': () => ({ ...last12Months(), label: '12 derniers mois' }),
  annee_derniere: () => ({ ...previousCalendarPeriod('annee'), label: 'Année dernière' }),
  semaine: () => ({ ...toDatePeriod('semaine'), label: 'Semaine à ce jour' }),
  mois: () => ({ ...toDatePeriod('mois'), label: 'Mois à ce jour' }),
  trimestre: () => ({ ...toDatePeriod('trimestre'), label: 'Trimestre à ce jour' }),
  annee: () => ({ ...toDatePeriod('annee'), label: 'Année à ce jour' }),
  ...named('q', [recentQuarters()]),
  ...named('bf', [recentBlackFridays()]),
  ...named('fete', recentFestivals()),
};

// Raccourcis tirés d'une liste datée (trimestres, Black Friday, fêtes) : la clé
// est le préfixe suivi du rang, le libellé celui de la liste.
function named(prefix: string, groups: NamedPeriod[][]): Record<string, () => Preset> {
  return Object.fromEntries(groups.flat().map((n, i) => [`${prefix}${i}`, () => ({ ...n.period, label: n.label })]));
}
function namedItems(prefix: string, groups: NamedPeriod[][]): Item[][] {
  let i = 0;
  return groups.map(g => g.map(n => [`${prefix}${i++}`, n.label] as const));
}

type Item = readonly [key: string, label: string];
// Un sous-menu s'ouvre à la place du menu principal, avec un retour en tête.
const SUBMENUS: Record<string, { title: string; groups: Item[][] }> = {
  derniers: { title: 'Derniers', groups: [
    [['30min', '30 dernières minutes'], ['12h', '12 dernières heures']],
    [['7j', '7 derniers jours'], ['30j', '30 derniers jours'], ['90j', '90 derniers jours'], ['365j', '365 derniers jours']],
    [['semaine_derniere', 'Semaine dernière'], ['mois_dernier', 'Mois dernier'], ['trimestre_dernier', 'Trimestre dernier'],
      ['12m', '12 derniers mois'], ['annee_derniere', 'Année dernière']],
  ] },
  a_ce_jour: { title: 'Période à ce jour', groups: [
    [['semaine', 'Semaine à ce jour'], ['mois', 'Mois à ce jour'], ['trimestre', 'Trimestre à ce jour'], ['annee', 'Année à ce jour']],
  ] },
  black_friday: { title: 'Black Friday', groups: namedItems('bf', [recentBlackFridays()]) },
  fetes: { title: 'Fêtes et temps forts', groups: namedItems('fete', recentFestivals()) },
  trimestres: { title: 'Trimestres', groups: namedItems('q', [recentQuarters()]) },
};
const MAIN: Item[][] = [
  [['aujourdhui', "Aujourd'hui"], ['hier', 'Hier']],
  [['derniers', 'Derniers'], ['a_ce_jour', 'Période à ce jour']],
  [['black_friday', 'Black Friday'], ['fetes', 'Fêtes et temps forts'], ['trimestres', 'Trimestres']],
  [['perso', 'Plage personnalisée']],
];
// Sur téléphone, le menu devient une liste déroulante : les sous-menus y sont dépliés.
const MOBILE_OPTIONS: SiriusSelectOption[] = MAIN.flatMap(group => [
  ...group.filter(([key]) => !SUBMENUS[key]),
  ...group.filter(([key]) => SUBMENUS[key]).flatMap(([key]) => SUBMENUS[key].groups.flat()),
]).map(([value, label]) => ({ value, label }));

const submenuOf = (key: string) =>
  Object.keys(SUBMENUS).find(m => SUBMENUS[m].groups.some(g => g.some(([k]) => k === key))) ?? null;

const DAY_HEADERS = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

const iso = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const fmt = (d: string, withYear: boolean) =>
  new Date(d + 'T00:00:00Z').toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', ...(withYear ? { year: 'numeric' } : {}), timeZone: 'UTC',
  });
export function formatRange(p: Period): string {
  if (p.from === p.to) return fmt(p.from, true);
  return `${fmt(p.from, p.from.slice(0, 4) !== p.to.slice(0, 4))} - ${fmt(p.to, true)}`;
}

function draftFromPreset(key: string): Draft {
  const p = (PRESETS[key] ?? PRESETS['30j'])();
  return { key: PRESETS[key] ? key : '30j', from: p.from, to: p.to, hours: !!p.fromTime, fromTime: p.fromTime ?? '00:00', toTime: p.toTime ?? '23:59' };
}
/** Période d'un raccourci, pour amorcer l'état de la page avant le premier choix. */
export function presetRange(key = '30j'): RangeValue {
  return (PRESETS[key] ?? PRESETS['30j'])();
}

// null quand les heures rendent la plage vide (même jour, fin avant début).
function resolve(d: Draft): RangeValue | null {
  if (d.hours && d.from === d.to && d.fromTime > d.toTime) return null;
  const times = d.hours ? { fromTime: d.fromTime, toTime: d.toTime } : {};
  const label = d.key !== 'perso' ? PRESETS[d.key]().label
    : formatRange(d) + (d.hours ? `, ${d.fromTime} - ${d.toTime}` : '');
  return { from: d.from, to: d.to, ...times, label };
}

export function SiriusDateRangePicker({
  label, initialPreset = '30j', onApply, variant = 'default', align = 'right', className = '',
}: SiriusDateRangePickerProps) {
  const [open, setOpen] = useState(false);
  // Bas du bouton de période, lu à l'ouverture : sur téléphone le panneau
  // s'ouvre juste en dessous, la ligne du bouton reste visible.
  const [anchor, setAnchor] = useState(0);
  const [applied, setApplied] = useState<Draft>(() => draftFromPreset(initialPreset));
  const [draft, setDraft] = useState<Draft>(applied);
  const [menu, setMenu] = useState<string | null>(submenuOf(applied.key));
  // Premier clic dans le calendrier : début posé, fin en attente du second clic.
  const [picking, setPicking] = useState(false);
  const range = resolve(draft);
  const today = new Date().toISOString().slice(0, 10);
  // Mois affiché à droite ; celui de gauche est le précédent.
  const [view, setView] = useState(() => { const t = new Date(); return { y: t.getUTCFullYear(), m: t.getUTCMonth() }; });
  const wrapRef = useRef<HTMLDivElement>(null);

  const showMonthOf = (d: string) => setView({ y: Number(d.slice(0, 4)), m: Number(d.slice(5, 7)) - 1 });
  const close = () => { setDraft(applied); setMenu(submenuOf(applied.key)); setPicking(false); setOpen(false); };

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => { if (!wrapRef.current?.contains(e.target as Node)) close(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  });

  const choosePreset = (key: string) => {
    const next = draftFromPreset(key);
    setDraft(next); setPicking(false); showMonthOf(next.to);
  };
  // Toute retouche à la main : plage personnalisée.
  const edit = (patch: Partial<Draft>) => {
    const next = { ...draft, ...patch, key: 'perso' };
    setDraft(next); showMonthOf(next.to);
  };

  const pickDay = (d: string) => {
    if (!picking) { setDraft({ ...draft, key: 'perso', from: d, to: d }); setPicking(true); return; }
    setDraft({ ...draft, key: 'perso', from: d < draft.from ? d : draft.from, to: d < draft.from ? draft.from : d });
    setPicking(false);
  };

  const clickMenu = (key: string) => {
    if (SUBMENUS[key]) setMenu(key);
    else if (key === 'perso') { setDraft({ ...draft, key: 'perso' }); setPicking(false); }
    else choosePreset(key);
  };

  const apply = () => {
    if (!range) return;
    setApplied(draft); setPicking(false); setOpen(false);
    onApply(range);
  };
  const appliedRange = resolve(applied);
  const unchanged = !!range && !!appliedRange && range.from === appliedRange.from && range.to === appliedRange.to
    && range.fromTime === appliedRange.fromTime && range.toTime === appliedRange.toTime;

  const months = [view.m === 0 ? { y: view.y - 1, m: 11 } : { y: view.y, m: view.m - 1 }, view];
  const shift = (n: number) => setView(v => {
    const d = new Date(Date.UTC(v.y, v.m + n, 1));
    return { y: d.getUTCFullYear(), m: d.getUTCMonth() };
  });

  const groups = menu ? SUBMENUS[menu].groups : MAIN;
  // Dans le menu principal, l'entrée d'un sous-menu reste marquée quand le choix en vient.
  const isActive = (key: string) => draft.key === key || (!menu && submenuOf(draft.key) === key);

  return (
    <div className={`sirius-drp sirius-drp--${variant} sirius-drp--align-${align} ${className}`.trim()} ref={wrapRef}>
      <button type="button" className="sirius-drp__trigger" onClick={e => {
        if (open) { close(); return; }
        setAnchor(e.currentTarget.getBoundingClientRect().bottom); setOpen(true);
      }}
        aria-expanded={open} aria-haspopup="dialog">
        <Icon name="calendar" size={15} />
        <span>{label ?? appliedRange?.label}</span>
      </button>
      {open && (
        <div className="sirius-drp__pop" role="dialog" aria-label="Choisir une période"
          style={{ '--sirius-drp-top': `${anchor}px` } as React.CSSProperties}>
          <nav className="sirius-drp__menu">
            {menu && (
              <button type="button" className="sirius-drp__menu-back" onClick={() => setMenu(null)}
                aria-label={`Retour, quitter ${SUBMENUS[menu].title}`}>
                <Icon name="arrow-left" size={18} />
                <span className="sirius-drp__roll" aria-hidden="true">
                  <span className="sirius-drp__roll-a">{SUBMENUS[menu].title}</span>
                  <span className="sirius-drp__roll-b">Retour</span>
                </span>
              </button>
            )}
            {groups.map((group, i) => (
              <div className="sirius-drp__menu-group" key={`${menu}-${i}`}>
                {group.map(([key, itemLabel]) => (
                  <button type="button" key={key} className="sirius-drp__menu-item" aria-pressed={isActive(key)}
                    onClick={() => clickMenu(key)}>
                    {itemLabel}
                    {SUBMENUS[key] && <Icon name="chevron" size={18} />}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <div className="sirius-drp__body">
            <div className="sirius-drp__controls">
              <SiriusSelect className="sirius-drp__mobile-select" label="Période" labelHidden
                value={draft.key}
                options={MOBILE_OPTIONS} onChange={clickMenu} />
              <div className="sirius-drp__fields">
                <DateText key={`f${draft.from}`} label="Date de début" value={draft.from} max={today}
                  onChange={v => edit({ from: v, to: draft.to >= v ? draft.to : v })} />
                <Icon name="arrow-right" size={16} className="sirius-drp__arrow" aria-hidden="true" />
                <DateText key={`t${draft.to}`} label="Date de fin" value={draft.to} max={today}
                  onChange={v => edit(v < draft.from ? { from: v, to: draft.from } : { to: v })} />
                <button type="button" className="sirius-drp__clock" aria-pressed={draft.hours}
                  onClick={() => edit({ hours: !draft.hours })}
                  aria-label="Choisir les heures" title="Choisir les heures">
                  <Icon name="clock" size={16} />
                </button>
                {draft.hours && (
                  <>
                    {/* key : un raccourci qui change l'heure remet le champ à jour */}
                    <TimeField key={`f${draft.fromTime}`} label="Heure de début" value={draft.fromTime}
                      onChange={v => edit({ fromTime: v })} />
                    <Icon name="arrow-right" size={16} className="sirius-drp__arrow" aria-hidden="true" />
                    <TimeField key={`t${draft.toTime}`} label="Heure de fin" value={draft.toTime}
                      onChange={v => edit({ toTime: v })} />
                  </>
                )}
              </div>
            </div>

            <div className="sirius-drp__months">
              <button type="button" className="sirius-drp__nav sirius-drp__nav--prev" onClick={() => shift(-1)} aria-label="Mois précédent">
                <Icon name="chevron-left" size={20} />
              </button>
              <button type="button" className="sirius-drp__nav sirius-drp__nav--next" onClick={() => shift(1)} aria-label="Mois suivant">
                <Icon name="chevron" size={20} />
              </button>
              {months.map(({ y, m }) => {
                const firstWeekday = (new Date(Date.UTC(y, m, 1)).getUTCDay() + 6) % 7; // lundi = 0
                const daysInMonth = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
                return (
                  <div className="sirius-drp__month" key={`${y}-${m}`}>
                    <span className="sirius-cal__title">
                      {new Date(Date.UTC(y, m, 1)).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
                    </span>
                    <div className="sirius-cal__grid">
                      {DAY_HEADERS.map(h => <span key={h} className="sirius-cal__dow">{h}</span>)}
                      {Array.from({ length: firstWeekday }, (_, i) => <span key={`b${i}`} />)}
                      {Array.from({ length: daysInMonth }, (_, i) => {
                        const d = iso(y, m, i + 1);
                        const cls = ['sirius-cal__day'];
                        if (d === draft.from || d === draft.to) cls.push('is-edge');
                        else if (d > draft.from && d < draft.to) cls.push('is-in-range');
                        if (d === today) cls.push('is-today');
                        return (
                          <button type="button" key={d} className={cls.join(' ')} disabled={d > today}
                            onClick={() => pickDay(d)}>
                            {i + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="sirius-drp__foot">
              {!range && <span className="sirius-drp__error">L&apos;heure de fin est avant l&apos;heure de début</span>}
              <SiriusButton variant="default" onClick={close}>Annuler</SiriusButton>
              <SiriusButton variant="primary" onClick={apply} disabled={!range || unchanged}>Appliquer</SiriusButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const TIMES = Array.from({ length: 48 }, (_, i) =>
  `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`);

// Champ d'heure en 24 h : on tape les chiffres (les heures impossibles sont
// refusées à la frappe) ou on choisit dans la liste de 30 en 30 minutes.
// `value` est toujours une heure valide : la saisie partielle est complétée
// à la sortie du champ, un champ vidé reprend l'heure d'avant.
function TimeField(props: { label: string; value: string; onChange: (v: string) => void }) {
  const [text, setText] = useState(props.value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  // À l'ouverture, la liste se place sur l'heure la plus proche.
  useEffect(() => {
    if (!open) return;
    const i = TIMES.filter(t => t <= props.value).length - 1;
    listRef.current?.children[Math.max(i, 0)]?.scrollIntoView({ block: 'center' });
  }, [open, props.value]);
  useEffect(() => {
    if (active >= 0) listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const commit = (v: string | null) => {
    const next = v ?? props.value;
    setText(next); setOpen(false); setActive(-1);
    if (next !== props.value) props.onChange(next);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); setOpen(true);
      setActive(a => (a < 0 ? Math.max(TIMES.filter(t => t <= props.value).length - 1, 0)
        : (a + (e.key === 'ArrowDown' ? 1 : -1) + TIMES.length) % TIMES.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      commit(open && active >= 0 ? TIMES[active] : finishTime(text));
    } else if (e.key === 'Escape' && open) {
      // Ferme la liste seulement, pas tout le sélecteur de période.
      e.stopPropagation(); setText(props.value); setOpen(false); setActive(-1);
    }
  };

  return (
    <div className="sirius-drp__time-wrap">
      <label className="sirius-drp__input sirius-drp__time">
        <Icon name="clock" size={14} />
        <input type="text" inputMode="numeric" placeholder="HH:mm" maxLength={5}
          aria-label={props.label} role="combobox" aria-expanded={open} aria-controls={listId}
          aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
          value={text}
          onFocus={() => setOpen(true)}
          onBlur={() => commit(finishTime(text))}
          onChange={e => { setText(maskTime(e.target.value)); setOpen(true); setActive(-1); }}
          onKeyDown={onKeyDown} />
      </label>
      {open && (
        <ul className="sirius-drp__time-list" role="listbox" id={listId} ref={listRef}>
          {TIMES.map((t, i) => (
            <li key={t} id={`${listId}-${i}`} role="option" aria-selected={t === props.value}
              className={i === active ? 'is-active' : undefined}
              // mousedown + preventDefault : le champ ne perd pas le focus avant le choix
              onMouseDown={e => { e.preventDefault(); commit(t); }}>
              {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Champ de date en toutes lettres (« 1er janvier 2026 »). On peut y taper
// « 5 oct 2026 » ou « 05/10/2026 » : relu à la sortie du champ, une date
// impossible ou à venir reprend la valeur d'avant.
function DateText(props: { label: string; value: string; max: string; onChange: (v: string) => void }) {
  // Sur téléphone le champ est trop étroit pour « 6 septembre 2026 » : mois abrégé.
  // ponytail: lu à l'ouverture du champ seulement, pas au redimensionnement.
  const [short] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 1023.98px)').matches);
  const [text, setText] = useState(formatDateLong(props.value, short));
  const commit = () => {
    const d = parseDateFr(text);
    if (d && d <= props.max && d !== props.value) props.onChange(d);
    else setText(formatDateLong(props.value, short));
  };
  return (
    <input className="sirius-drp__input" type="text" aria-label={props.label} value={text}
      onChange={e => setText(e.target.value)} onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); commit(); } }} />
  );
}
