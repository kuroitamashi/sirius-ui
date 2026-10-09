'use client';

import { useState } from 'react';
import { Icon } from '../Icon/Icon';
import './date-picker.css';

export interface SiriusDatePickerProps {
  /** Date choisie, au format ISO « 2027-06-17 ». Chaîne vide si aucune. */
  value: string;
  onChange: (date: string) => void;
  /** Jours avant cette date non sélectionnables (ISO). */
  min?: string;
  /** Jours après cette date non sélectionnables (ISO). */
  max?: string;
  className?: string;
}

const DAY_HEADERS = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

const iso = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

// Calendrier une seule date, affiché en place (pas de fenêtre) : même look
// que les mois du sélecteur de période.
export function SiriusDatePicker({ value, onChange, min, max, className = '' }: SiriusDatePickerProps) {
  const now = new Date();
  const initial = value || iso(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const [year, setYear] = useState(Number(initial.slice(0, 4)));
  const [month, setMonth] = useState(Number(initial.slice(5, 7)) - 1);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1); };

  const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7; // lundi = 0
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const today = iso(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  return (
    <div className={`sirius-cal ${className}`.trim()} role="group" aria-label="Choisir une date">
      <div className="sirius-cal__head">
        <button type="button" className="sirius-drp__nav" onClick={prevMonth} aria-label="Mois précédent">
          <Icon name="chevron-left" size={20} />
        </button>
        <span className="sirius-cal__title">
          {new Date(Date.UTC(year, month, 1)).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
        </span>
        <button type="button" className="sirius-drp__nav" onClick={nextMonth} aria-label="Mois suivant">
          <Icon name="chevron" size={20} />
        </button>
      </div>
      <div className="sirius-cal__grid">
        {DAY_HEADERS.map(h => <span key={h} className="sirius-cal__dow">{h}</span>)}
        {Array.from({ length: firstWeekday }, (_, i) => <span key={`b${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = iso(year, month, i + 1);
          const cls = ['sirius-cal__day'];
          if (day === value) cls.push('is-edge');
          if (day === today) cls.push('is-today');
          return (
            <button key={day} type="button" className={cls.join(' ')}
              disabled={(!!min && day < min) || (!!max && day > max)}
              aria-pressed={day === value}
              onClick={() => onChange(day)}>
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
