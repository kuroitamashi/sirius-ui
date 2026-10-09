export type Granularity = 'jour' | 'semaine' | 'mois';
export type Period = { from: string; to: string };

const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);

export function resolvePreset(preset: string, today: Date = new Date()): Period {
  const t = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  switch (preset) {
    case 'aujourdhui': return { from: iso(t), to: iso(t) };
    case 'hier': { const y = addDays(t, -1); return { from: iso(y), to: iso(y) }; }
    case '7j': return { from: iso(addDays(t, -6)), to: iso(t) };
    case '30j': return { from: iso(addDays(t, -29)), to: iso(t) };
    case 'ce_mois':
      return { from: iso(new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), 1))), to: iso(t) };
    case 'mois_dernier': {
      const first = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth() - 1, 1));
      const last = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), 0));
      return { from: iso(first), to: iso(last) };
    }
    default: return resolvePreset('30j', today);
  }
}

export function previousPeriod(p: Period): Period {
  const from = new Date(p.from + 'T00:00:00Z');
  const to = new Date(p.to + 'T00:00:00Z');
  const days = Math.round((to.getTime() - from.getTime()) / 86400000) + 1;
  return { from: iso(addDays(from, -days)), to: iso(addDays(from, -1)) };
}

// Granularity chosen from the length of the period, so the home strip needs no
// selector: a sparkline of 365 daily points is noise, one of 12 months reads.
export function autoGranularity(p: Period): Granularity {
  const days = Math.round(
    (new Date(p.to + 'T00:00:00Z').getTime() - new Date(p.from + 'T00:00:00Z').getTime()) / 86400000,
  ) + 1;
  return days <= 31 ? 'jour' : days <= 183 ? 'semaine' : 'mois';
}

// --- Sélecteur de période façon Shopify (accueil) ---

export type LastUnit = 'jours' | 'semaines' | 'mois' | 'trimestres' | 'annees';
export type ToDateUnit = 'semaine' | 'mois' | 'trimestre' | 'annee';

const utcDay = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

// Recule de n mois en restant dans le mois visé : 31 mars - 1 mois = 28 ou 29 février.
function addMonths(d: Date, n: number): Date {
  const y = d.getUTCFullYear(), m = d.getUTCMonth() + n;
  const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return new Date(Date.UTC(y, m, Math.min(d.getUTCDate(), last)));
}

// « Derniers 90 jours » : n unités qui finissent aujourd'hui, ou hier si on exclut aujourd'hui.
export function lastPeriod(n: number, unit: LastUnit, includeToday: boolean, today: Date = new Date()): Period {
  const end = addDays(utcDay(today), includeToday ? 0 : -1);
  const start = unit === 'jours' ? addDays(end, -(n - 1))
    : unit === 'semaines' ? addDays(end, -(7 * n - 1))
    : addDays(addMonths(end, -n * (unit === 'mois' ? 1 : unit === 'trimestres' ? 3 : 12)), 1);
  return { from: iso(start), to: iso(end) };
}

// « Mois à ce jour » : du début de la semaine (lundi), du mois, du trimestre ou de l'année jusqu'à aujourd'hui.
export function toDatePeriod(unit: ToDateUnit, today: Date = new Date()): Period {
  const t = utcDay(today);
  const y = t.getUTCFullYear(), m = t.getUTCMonth();
  const start = unit === 'semaine' ? addDays(t, -((t.getUTCDay() + 6) % 7))
    : unit === 'mois' ? new Date(Date.UTC(y, m, 1))
    : unit === 'trimestre' ? new Date(Date.UTC(y, m - (m % 3), 1))
    : new Date(Date.UTC(y, 0, 1));
  return { from: iso(start), to: iso(t) };
}

// Week-end Black Friday Cyber Monday : du vendredi qui suit le 4e jeudi de
// novembre au lundi suivant.
export function blackFridayWeekend(year: number): Period {
  const nov1 = new Date(Date.UTC(year, 10, 1));
  const friday = addDays(nov1, ((4 - nov1.getUTCDay() + 7) % 7) + 21 + 1);
  return { from: iso(friday), to: iso(addDays(friday, 3)) };
}

export type NamedPeriod = { label: string; period: Period };
const clip = (p: Period, today: string): Period => ({ from: p.from, to: p.to > today ? today : p.to });

// Les week-ends Black Friday déjà commencés, du plus récent au plus ancien.
export function recentBlackFridays(today: Date = new Date(), count = 4): NamedPeriod[] {
  const t = iso(utcDay(today));
  const out: NamedPeriod[] = [];
  for (let y = utcDay(today).getUTCFullYear(); out.length < count; y--) {
    const p = blackFridayWeekend(y);
    if (p.from <= t) out.push({ label: `Black Friday ${y}`, period: clip(p, t) });
  }
  return out;
}

// Fêtes qui suivent le calendrier lunaire : le jour J tel qu'observé au
// Sénégal, à un jour près (la commission du croissant lunaire et certaines
// familles religieuses annoncent parfois deux dates). Sources : timeanddate,
// pressafrik, senego. ponytail: table tenue à la main, ajouter l'année
// suivante chaque janvier, sinon ses fêtes n'apparaissent pas.
const LUNAR: Record<number, { korite: string; tabaski: string; magal: string; gamou: string }> = {
  2022: { korite: '2022-05-02', tabaski: '2022-07-10', magal: '2022-09-15', gamou: '2022-10-08' },
  2023: { korite: '2023-04-22', tabaski: '2023-06-29', magal: '2023-09-04', gamou: '2023-09-27' },
  2024: { korite: '2024-04-10', tabaski: '2024-06-17', magal: '2024-08-23', gamou: '2024-09-16' },
  2025: { korite: '2025-03-30', tabaski: '2025-06-07', magal: '2025-08-13', gamou: '2025-09-05' },
  2026: { korite: '2026-03-20', tabaski: '2026-05-28', magal: '2026-08-03', gamou: '2026-08-25' },
};

// Une fête, c'est la période où l'on achète pour elle : la semaine qui
// précède Tabaski et Korité (habits, moutons, couture), les trois jours
// avant le Magal et le Gamou (voyage, provisions), tout le mois de Ramadan.
function festivalsOf(y: number): NamedPeriod[] {
  const before = (day: string, n: number) => ({ from: iso(addDays(new Date(day + 'T00:00:00Z'), -n)), to: day });
  const l = LUNAR[y];
  const list: NamedPeriod[] = [
    { label: `Saint-Valentin ${y}`, period: { from: `${y}-02-07`, to: `${y}-02-14` } },
    { label: `Noël et fin d'année ${y}`, period: { from: `${y}-12-15`, to: `${y}-12-31` } },
  ];
  if (l) {
    const k = new Date(l.korite + 'T00:00:00Z');
    list.push(
      { label: `Ramadan ${y}`, period: { from: iso(addDays(k, -30)), to: iso(addDays(k, -1)) } },
      { label: `Korité ${y}`, period: before(l.korite, 7) },
      { label: `Tabaski ${y}`, period: before(l.tabaski, 7) },
      { label: `Magal de Touba ${y}`, period: before(l.magal, 3) },
      { label: `Gamou ${y}`, period: before(l.gamou, 3) },
    );
  }
  return list;
}

// Les fêtes déjà commencées de l'année en cours et de la précédente, la plus
// récente en premier ; une fête en cours s'arrête à aujourd'hui.
export function recentFestivals(today: Date = new Date()): NamedPeriod[][] {
  const t = iso(utcDay(today));
  const y = utcDay(today).getUTCFullYear();
  return [y, y - 1].map(year => festivalsOf(year)
    .filter(f => f.period.from <= t)
    .map(f => ({ ...f, period: clip(f.period, t) }))
    .sort((a, b) => b.period.from.localeCompare(a.period.from)))
    .filter(g => g.length > 0);
}

// Les 8 derniers trimestres, le trimestre en cours coupé à aujourd'hui.
export function recentQuarters(today: Date = new Date()): { label: string; period: Period }[] {
  const t = utcDay(today);
  const q0 = Math.floor(t.getUTCMonth() / 3);
  return Array.from({ length: 8 }, (_, i) => {
    const start = new Date(Date.UTC(t.getUTCFullYear(), (q0 - i) * 3, 1));
    const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 3, 0));
    return {
      label: `T${start.getUTCMonth() / 3 + 1} ${start.getUTCFullYear()}`,
      period: { from: iso(start), to: iso(end > t ? t : end) },
    };
  });
}

// Plage avec heures (bouton horloge du sélecteur). Les dates de commande sont
// en ISO UTC, l'heure de Dakar : comparer les 16 premiers caractères suffit.
export const isTime = (s: string | null): s is string => !!s && /^([01]\d|2[0-3]):[0-5]\d$/.test(s);
export function withinHours(dateIso: string, p: Period, fromTime: string, toTime: string): boolean {
  const t = dateIso.slice(0, 16);
  return t >= `${p.from}T${fromTime}` && t <= `${p.to}T${toTime}`;
}

// Saisie d'une heure chiffre par chiffre, en 24 h. Ce qui rendrait l'heure
// impossible est refusé au moment de la frappe : 8 devient 08, 25 h et 76 min
// ne passent pas. Renvoie le texte affiché, avec les deux-points après l'heure.
export function maskTime(raw: string): string {
  let out = '';
  for (const c of raw.replace(/\D/g, '')) {
    if (out.length === 0) out = c > '2' ? '0' + c : c;
    else if (out.length === 1) { if (!(out[0] === '2' && c > '3')) out += c; }
    else if (out.length === 2) { if (c <= '5') out += c; }
    else if (out.length === 3) out += c;
  }
  return out.length > 2 ? `${out.slice(0, 2)}:${out.slice(2)}` : out;
}

// Complète une saisie partielle à la sortie du champ : 8 → 08:00, 08:3 → 08:30.
// null si le champ est vide (on garde alors l'heure d'avant).
export function finishTime(masked: string): string | null {
  const d = masked.replace(/\D/g, '');
  if (!d) return null;
  const h = d.length === 1 ? '0' + d : d.slice(0, 2);
  return `${h}:${(d.slice(2) + '00').slice(0, 2)}`;
}

// « Semaine dernière », « Mois dernier »… : l'unité calendaire complète
// d'avant celle en cours (semaine du lundi au dimanche).
export function previousCalendarPeriod(unit: ToDateUnit, today: Date = new Date()): Period {
  const cur = new Date(toDatePeriod(unit, today).from + 'T00:00:00Z');
  const end = addDays(cur, -1);
  const start = unit === 'semaine' ? addDays(cur, -7)
    : new Date(Date.UTC(cur.getUTCFullYear(), cur.getUTCMonth() - (unit === 'mois' ? 1 : unit === 'trimestre' ? 3 : 12), 1));
  return { from: iso(start), to: iso(end) };
}

// « 12 derniers mois » : les 12 mois complets avant le mois en cours.
export function last12Months(today: Date = new Date()): Period {
  const t = utcDay(today);
  return {
    from: iso(new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth() - 12, 1))),
    to: iso(new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), 0))),
  };
}

// Fenêtre précédente d'une plage avec heures : même durée, juste avant.
// 12 dernières heures (08:00 → 20:00) se compare à 20:00 → 08:00 la veille.
export type TimedPeriod = Period & { fromTime: string; toTime: string };
export function previousWindow(p: TimedPeriod): TimedPeriod {
  const start = Date.parse(`${p.from}T${p.fromTime}:00Z`);
  const end = Date.parse(`${p.to}T${p.toTime}:00Z`) + 60_000; // la minute de fin est incluse
  const ps = new Date(start - (end - start)); const pe = new Date(start - 60_000);
  return {
    from: ps.toISOString().slice(0, 10), fromTime: ps.toISOString().slice(11, 16),
    to: pe.toISOString().slice(0, 10), toTime: pe.toISOString().slice(11, 16),
  };
}

// Dates lisibles dans les champs du sélecteur : « 1er janvier 2026 ».
const MONTHS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const plain = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const MONTHS_SHORT_FR = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

// short : « 6 sept. 2026 », pour les champs étroits du téléphone.
export function formatDateLong(day: string, short = false): string {
  const [y, m, d] = day.split('-').map(Number);
  return `${d === 1 ? '1er' : d} ${(short ? MONTHS_SHORT_FR : MONTHS_FR)[m - 1]} ${y}`;
}

// Relit ce que la marchande tape : « 1er janvier 2026 », « 5 oct 2026 »,
// « 05/10/2026 » (jour d'abord) ou « 2026-10-05 ». null si la date n'existe pas.
export function parseDateFr(raw: string): string | null {
  const s = plain(raw.trim()).replace(/\b1er\b/, '1').replace(/\s+/g, ' ');
  let y: number, m: number, d: number;
  let r: RegExpMatchArray | null;
  if ((r = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) [y, m, d] = [+r[1], +r[2], +r[3]];
  else if ((r = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/))) [d, m, y] = [+r[1], +r[2], +r[3]];
  else if ((r = s.match(/^(\d{1,2}) ([a-z]+)\.? (\d{4})$/))) {
    // « juil » et « juin » sont distincts, « jui » est ambigu : il faut un seul mois possible.
    const hits = MONTHS_FR.map((name, i) => [plain(name), i] as const).filter(([n]) => n.startsWith(r![2]));
    if (r[2].length < 3 || hits.length !== 1) return null;
    [d, m, y] = [+r[1], hits[0][1] + 1, +r[3]];
  } else return null;
  if (m < 1 || m > 12 || d < 1 || d > new Date(Date.UTC(y, m, 0)).getUTCDate()) return null;
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
