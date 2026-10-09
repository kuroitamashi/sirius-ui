'use client';

import React, { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Icon } from '../Icon/Icon';
import { useSiriusFrame, type SiriusFrameLink } from './Frame';

export interface SiriusNavSubItem {
  label: string;
  /** Sans lien : entrée « bientôt ». */
  href?: string;
}

export interface SiriusNavItem {
  label: string;
  icon: string;
  /** Sans lien ni sous-menu : entrée « bientôt ». */
  href?: string;
  /** Actif seulement sur ce chemin exact (l'accueil), pas sur ses sous-pages. */
  exact?: boolean;
  /** Travail en attente. Absent ou nul, rien ne s'affiche. */
  badge?: number;
  /** Groupe dépliable : le parent ne navigue pas, il ouvre ou ferme. */
  children?: SiriusNavSubItem[];
}

export interface SiriusNavSection {
  title?: string;
  items: SiriusNavItem[];
}

export interface SiriusSidebarProps {
  /** Page courante, pour l'entrée active. */
  pathname: string;
  sections: SiriusNavSection[];
  /** Logo en tête de barre, et page où il mène. */
  brand: { src: string; alt: string; href: string };
  /** Entrée ancrée en bas (Paramètres). */
  footerItem?: SiriusNavItem;
  /** Menu boutique et compte, en pied de barre. */
  menu?: React.ReactNode;
  /** Cloche des alertes, à côté du menu. */
  cloche?: React.ReactNode;
  /** Carte posée au-dessus du pied, barre dépliée seulement (visite d'une boutique). */
  carte?: React.ReactNode;
  /** Composant de lien de l'application (Next.js `Link`), `a` par défaut. */
  linkComponent?: SiriusFrameLink;
}

// Même seuil que le tiroir du cadre. Le serveur rend la version bureau ; sur
// mobile la bascule se fait à l'hydratation, tiroir encore fermé.
const MOBILE = '(max-width: 1023.98px)';
const abonnerMobile = (cb: () => void) => {
  const m = window.matchMedia(MOBILE);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};

const estActif = (pathname: string, item: SiriusNavItem) =>
  !!item.href && (item.exact || item.href === '/' ? pathname === item.href : pathname.startsWith(item.href));

/**
 * La barre latérale sombre d'une application SKS, à poser dans `SiriusFrame`.
 * Repliable en rail d'icônes, en tiroir sur mobile, recherche Ctrl+K en tête.
 */
export function SiriusSidebar({
  pathname,
  sections,
  brand,
  footerItem,
  menu,
  cloche,
  carte,
  linkComponent: L = 'a',
}: SiriusSidebarProps) {
  const frame = useSiriusFrame();
  const mobile = useSyncExternalStore(abonnerMobile, () => window.matchMedia(MOBILE).matches, () => false);

  const rendre = (item: SiriusNavItem) =>
    item.children ? (
      <NavGroup key={item.label} item={item} pathname={pathname} L={L} />
    ) : item.href ? (
      <L key={item.label} href={item.href} className={`sidebar-item${estActif(pathname, item) ? ' active' : ''}`} data-label={item.label}>
        <Icon name={item.icon} size={20} />
        <span className="sidebar-label">{item.label}</span>
        {!!item.badge && (
          <span className="sidebar-badge" aria-label={`${item.badge} à traiter`}>{item.badge}</span>
        )}
      </L>
    ) : (
      <span key={item.label} className="sidebar-item disabled" data-label={`${item.label} (bientôt)`}>
        <Icon name={item.icon} size={20} />
        <span className="sidebar-label">{item.label}</span>
        <span className="soon">bientôt</span>
      </span>
    );

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <L href={brand.href} className="sidebar-brand" aria-label="Accueil">
          <img className="sidebar-brand-mark" src={brand.src} alt={brand.alt} width={28} height={28} />
        </L>
        {mobile ? (
          // En tiroir : paramètres, cloche et compte montent en tête. Rendus à
          // un seul endroit à la fois : une cloche qui interroge le serveur ne
          // doit pas exister en double.
          <div className="sidebar-top-actions">
            <div className="sidebar-pill">
              {footerItem?.href && (
                <L href={footerItem.href} className="sidebar-pill-btn" aria-label={footerItem.label}>
                  <Icon name={footerItem.icon} size={20} />
                </L>
              )}
              {cloche}
            </div>
            {menu && <div className="sidebar-pill">{menu}</div>}
          </div>
        ) : (
          <Bascule brand={brand} L={L} />
        )}
      </div>

      <button type="button" className="sidebar-search" onClick={() => frame?.onOpenSearch()} aria-label="Rechercher (Ctrl+K)">
        <Icon name="search" size={24} />
        <span className="sidebar-search-text">Rechercher</span>
        <kbd className="sidebar-search-kbd">Ctrl K</kbd>
      </button>

      <nav className="sidebar-nav">
        {sections.map((s, i) => (
          <div key={s.title ?? i} className="sidebar-section-wrap">
            {s.title && <div className="sidebar-section">{s.title}</div>}
            {s.items.map(rendre)}
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        {!frame?.replie && carte}
        {footerItem && !mobile && <div className="sidebar-reglages">{rendre(footerItem)}</div>}
        {!mobile && (menu || cloche) && (
          <div className="sidebar-user-section">
            <div className="sidebar-menu-wrapper">{menu}</div>
            {cloche && <div className="sidebar-bell-wrapper">{cloche}</div>}
          </div>
        )}
      </div>
    </aside>
  );
}

/** Replie ou déplie la barre (Ctrl+B). En rail imposé, le logo ramène à la sortie. */
function Bascule({ brand, L }: { brand: SiriusSidebarProps['brand']; L: SiriusFrameLink }) {
  const frame = useSiriusFrame();
  const marque = <img className="sidebar-brand-mark" src={brand.src} alt="" width={28} height={28} />;

  if (frame?.railImpose) {
    return (
      <L href={frame.railSortieHref ?? brand.href} className="sidebar-toggle sidebar-toggle-fixe" aria-label="Quitter les paramètres">
        <span className="sidebar-toggle-brand-slot">{marque}</span>
      </L>
    );
  }

  return (
    <button
      className="sidebar-toggle"
      aria-label={frame?.replie ? 'Déplier la barre latérale (Ctrl+B)' : 'Replier la barre latérale (Ctrl+B)'}
      onClick={() => frame?.onSidebar()}
    >
      {frame?.replie ? (
        <span className="sidebar-toggle-brand-slot">
          {marque}
          <span className="sidebar-toggle-hover-icon"><Icon name="panel-open" size={20} /></span>
        </span>
      ) : (
        <Icon name="panel-close" size={20} />
      )}
    </button>
  );
}

// Groupe à sous-menus. Barre dépliée : clic pour ouvrir ou fermer ; le groupe
// dont un enfant est la page courante est ouvert par défaut, jusqu'à ce qu'on
// le referme. En rail, le sous-menu sort en menu flottant : au survol (fermé
// 220 ms après la sortie, pour laisser la souris traverser) ou au clic, refermé
// au clic dehors, à Échap ou au choix d'un enfant.
function NavGroup({ item, pathname, L }: { item: SiriusNavItem; pathname: string; L: SiriusFrameLink }) {
  const items = item.children ?? [];
  // enfant actif = le lien le plus long qui préfixe l'URL courante
  const actif = items.reduce<SiriusNavSubItem | null>((best, it) => {
    if (!it.href) return best;
    const match = pathname === it.href || pathname.startsWith(it.href + '/');
    return match && (!best || it.href.length > (best.href?.length ?? 0)) ? it : best;
  }, null);
  // null = état par défaut (ouvert si un enfant est actif, sauf en rail)
  const [manuel, setManuel] = useState<boolean | null>(null);
  const rail = !!useSiriusFrame()?.replie;
  const ref = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const minuteur = useRef<ReturnType<typeof setTimeout> | null>(null);
  // passer du rail au déployé (et inversement) repart de l'état par défaut
  const [railPrec, setRailPrec] = useState(rail);
  if (railPrec !== rail) { setRailPrec(rail); setManuel(null); }
  const ouvert = rail ? manuel === true : (manuel ?? !!actif);

  // Le menu flottant descend depuis le parent ; s'il dépasse le bas de la
  // fenêtre, il monte. Mesuré à chaque ouverture, l'écran a pu changer.
  useLayoutEffect(() => {
    const sub = subRef.current;
    if (!rail || !ouvert || !sub) return;
    sub.removeAttribute('data-vers-haut');
    if (sub.getBoundingClientRect().bottom > window.innerHeight - 8) sub.setAttribute('data-vers-haut', '');
  }, [rail, ouvert]);

  useEffect(() => () => { if (minuteur.current) clearTimeout(minuteur.current); }, []);

  useEffect(() => {
    if (!rail || !ouvert) return;
    const dehors = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setManuel(false); };
    const echap = (e: KeyboardEvent) => { if (e.key === 'Escape') setManuel(false); };
    document.addEventListener('pointerdown', dehors);
    document.addEventListener('keydown', echap);
    return () => {
      document.removeEventListener('pointerdown', dehors);
      document.removeEventListener('keydown', echap);
    };
  }, [rail, ouvert]);

  return (
    <div
      ref={ref}
      className={`sidebar-group${ouvert ? ' open' : ''}`}
      onMouseEnter={() => {
        if (!rail) return;
        if (minuteur.current) { clearTimeout(minuteur.current); minuteur.current = null; }
        setManuel(true);
      }}
      onMouseLeave={() => {
        if (!rail) return;
        if (minuteur.current) clearTimeout(minuteur.current);
        minuteur.current = setTimeout(() => setManuel(false), 220);
      }}
    >
      <button type="button" aria-expanded={ouvert} data-label={item.label}
        className={`sidebar-item sidebar-group-btn${!ouvert && actif ? ' active' : ''}`}
        onClick={() => setManuel(!ouvert)}>
        <Icon name={item.icon} size={20} />
        <span className="sidebar-label">{item.label}</span>
      </button>
      {/* toujours monté pour animer le dépliage ; inert quand fermé */}
      <div ref={subRef} className="sidebar-subwrap" inert={!ouvert}>
        <div className="sidebar-sub">
          {items.map(it =>
            it.href ? (
              <L key={it.label} href={it.href}
                className={`sidebar-subitem${actif?.href === it.href ? ' active' : ''}`}
                // en rail le menu se referme dès qu'on a choisi ; déployé, le
                // groupe reste ouvert sur l'enfant choisi
                onClick={() => setManuel(rail ? false : null)}>
                {it.label}
              </L>
            ) : (
              <span key={it.label} className="sidebar-subitem disabled">
                {it.label}
                <span className="soon">bientôt</span>
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
