'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Icon } from '../Icon/Icon';
import './frame.css';

/** Le composant de lien de l'application (Next.js `Link`), `a` par défaut. */
export type SiriusFrameLink = React.ElementType;

const CLE_LARGEUR = 'sks.compagnon.largeur';
const CLE_REPLIE = 'sks.sidebar.replie';

// Bornes du panneau compagnon : il peut respirer, il ne peut jamais avaler la page.
export const COMPAGNON_LARGEUR_MIN = 320;
export const COMPAGNON_LARGEUR_MAX = 560;
export const COMPAGNON_LARGEUR_DEFAUT = 360;
const PAS = 16; // pas du clavier

// Même seuil que le CSS du tiroir.
const MOBILE = '(max-width: 1023px)';

export interface SiriusFrameContext {
  replie: boolean;
  /** Rail imposé (mode réglages) : la barre ne se déplie pas. */
  railImpose: boolean;
  railSortieHref?: string;
  compagnon: boolean;
  searchOpen: boolean;
  onMenu: () => void;
  onSidebar: () => void;
  onCompagnon: () => void;
  onOpenSearch: () => void;
  onCloseSearch: () => void;
}

const FrameCtx = createContext<SiriusFrameContext | null>(null);

export function useSiriusFrame() {
  return useContext(FrameCtx);
}

export interface SiriusFrameProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  /** Page courante : ferme le tiroir mobile à chaque navigation. */
  pathname: string;
  topbar?: React.ReactNode;
  /** Bandeaux au-dessus du cadre (abonnement, démonstration). */
  banniere?: React.ReactNode;
  /** Fenêtre de recherche, ouverte par Ctrl+K ou par la barre latérale. */
  search?: (p: { open: boolean; onClose: () => void }) => React.ReactNode;
  /** Contenu du panneau compagnon (titre, corps, pied). Absent : pas de compagnon. */
  compagnon?: React.ReactNode;
  /** Libellé de l'îlot flottant qui ouvre le compagnon. */
  compagnonLibelle?: string;
  /** Masque l'îlot (l'accueil a déjà son champ). */
  masquerIlot?: boolean;
  /** Mode réglages : barre en rail imposé, sans toucher à la préférence enregistrée. */
  railImpose?: boolean;
  /** Où mène le logo quand le rail est imposé (quitter les réglages). */
  railSortieHref?: string;
}

/**
 * Le cadre d'une application SKS : barre latérale repliable en rail, tiroir sur
 * mobile, contenu en île blanche, compagnon en troisième colonne.
 * Ctrl+K ouvre la recherche, Ctrl+B replie la barre, Échap ferme.
 */
export function SiriusFrame({
  sidebar,
  children,
  pathname,
  topbar,
  banniere,
  search,
  compagnon: contenuCompagnon,
  compagnonLibelle = 'Compagnon SKS',
  masquerIlot = false,
  railImpose = false,
  railSortieHref,
}: SiriusFrameProps) {
  const [replie, setReplie] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [compagnon, setCompagnon] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [largeur, setLargeur] = useState(COMPAGNON_LARGEUR_DEFAUT);
  const [glisse, setGlisse] = useState(false);

  useEffect(() => {
    try {
      const v = Number(localStorage.getItem(CLE_LARGEUR));
      if (v >= COMPAGNON_LARGEUR_MIN && v <= COMPAGNON_LARGEUR_MAX) setLargeur(v);
      if (localStorage.getItem(CLE_REPLIE) === 'true') setReplie(true);
    } catch { /* stockage indisponible : on garde les défauts */ }
  }, []);

  const basculerReplie = () => {
    setReplie(prev => {
      const next = !prev;
      try { localStorage.setItem(CLE_REPLIE, String(next)); } catch { /* idem */ }
      return next;
    });
  };

  const majLargeur = (px: number) => {
    const borne = Math.min(COMPAGNON_LARGEUR_MAX, Math.max(COMPAGNON_LARGEUR_MIN, Math.round(px)));
    setLargeur(borne);
    try { localStorage.setItem(CLE_LARGEUR, String(borne)); } catch { /* idem */ }
  };

  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    if (drawer) setDrawer(false);
  }

  const replieEffectif = replie || railImpose;

  // Le CSS du rail lit cet attribut sur <html>, posé avant l'hydratation par
  // le script du <head> de l'application. Une seule source pour le tenir à jour.
  useEffect(() => {
    if (replieEffectif) document.documentElement.setAttribute('data-sidebar-replie', 'true');
    else document.documentElement.removeAttribute('data-sidebar-replie');
  }, [replieEffectif]);

  const mobile = () => typeof window !== 'undefined' && window.matchMedia(MOBILE).matches;

  const onMenu = () => {
    if (mobile()) setDrawer(true);
    else if (!railImpose) basculerReplie();
  };

  const onSidebar = () => {
    if (mobile()) setDrawer(false);
    else if (!railImpose) basculerReplie();
  };

  const onCompagnon = () => setCompagnon(c => !c);
  const onOpenSearch = () => { if (search) setSearchOpen(true); };
  const onCloseSearch = () => setSearchOpen(false);

  // Raccourcis globaux : Ctrl+K recherche, Ctrl+B barre latérale, Échap ferme.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key.toLowerCase() === 'k' && search) {
        e.preventDefault();
        setSearchOpen(prev => !prev);
        return;
      }
      // Ctrl+B met en gras dans un champ ou dans l'éditeur de texte riche :
      // là, il appartient au champ, pas à la barre latérale.
      const t = e.target as HTMLElement | null;
      const dansUnChamp = !!t?.closest('input, textarea, select, [contenteditable="true"]');
      if (ctrl && e.key.toLowerCase() === 'b' && !dansUnChamp) {
        e.preventDefault();
        onSidebar();
        return;
      }
      if (e.key === 'Escape') {
        if (searchOpen) setSearchOpen(false);
        else if (drawer) setDrawer(false);
        else if (compagnon) setCompagnon(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // onSidebar ne touche qu'à des setters : la recréer à chaque rendu ne change rien
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOpen, drawer, compagnon, search, railImpose]);

  return (
    <FrameCtx.Provider
      value={{
        replie: replieEffectif,
        railImpose,
        railSortieHref,
        compagnon,
        searchOpen,
        onMenu,
        onSidebar,
        onCompagnon,
        onOpenSearch,
        onCloseSearch,
      }}
    >
      <div
        className="shell"
        style={{ '--compagnon-w': `${largeur}px` } as React.CSSProperties}
        data-replie={replieEffectif ? '' : undefined}
        data-drawer={drawer ? '' : undefined}
        data-compagnon={compagnon ? '' : undefined}
        data-drag={glisse ? '' : undefined}
        data-settings={railImpose ? '' : undefined}
      >
        {banniere}
        {topbar}
        <div className="shell-body">
          {sidebar}
          {drawer && (
            <button className="shell-overlay" aria-label="Fermer le menu" onClick={() => setDrawer(false)} />
          )}
          <div className="main">
            {!topbar && (
              <button type="button" className="mobile-menu-trigger" aria-label="Ouvrir le menu" onClick={onMenu}>
                <Icon name="menu" size={24} />
              </button>
            )}
            {children}
            {contenuCompagnon && !masquerIlot && (
              <IlotCompagnon libelle={compagnonLibelle} ouvert={compagnon} onBasculer={onCompagnon} />
            )}
          </div>
          {contenuCompagnon && compagnon && (
            <PoigneeCompagnon largeur={largeur} onLargeur={majLargeur} onGlisse={setGlisse} />
          )}
          {contenuCompagnon && (
            // Rendu en permanence, fermé comme ouvert : un élément monté à
            // l'ouverture n'a pas d'état de départ, donc rien à animer. `inert`
            // le sort du focus clavier tant qu'il est fermé. `compagnon-inner`
            // porte la largeur : le contenu est révélé, pas comprimé.
            <aside className="compagnon" aria-label="Compagnon IA" inert={!compagnon}>
              <div className="compagnon-inner">{contenuCompagnon}</div>
            </aside>
          )}
        </div>
        {search?.({ open: searchOpen, onClose: onCloseSearch })}
      </div>
    </FrameCtx.Provider>
  );
}

// Poignée de redimensionnement. Elle vit DANS la gouttière, en frère du
// panneau : c'est l'espace entre le contenu et le panneau qu'on attrape.
function PoigneeCompagnon({ largeur, onLargeur, onGlisse }: {
  largeur: number;
  onLargeur: (px: number) => void;
  onGlisse: (actif: boolean) => void;
}) {
  return (
    <button
      className="compagnon-poignee"
      role="separator"
      aria-orientation="vertical"
      aria-label="Redimensionner le compagnon"
      aria-valuenow={largeur}
      aria-valuemin={COMPAGNON_LARGEUR_MIN}
      aria-valuemax={COMPAGNON_LARGEUR_MAX}
      onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); onGlisse(true); }}
      onPointerMove={e => { if (e.currentTarget.hasPointerCapture(e.pointerId)) onLargeur(window.innerWidth - e.clientX); }}
      onPointerUp={e => { e.currentTarget.releasePointerCapture(e.pointerId); onGlisse(false); }}
      // Gauche élargit (le panneau vient de la droite), droite rétrécit.
      onKeyDown={e => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); onLargeur(largeur + PAS); }
        if (e.key === 'ArrowRight') { e.preventDefault(); onLargeur(largeur - PAS); }
      }}
    />
  );
}

function IlotCompagnon({ libelle, ouvert, onBasculer }: { libelle: string; ouvert: boolean; onBasculer: () => void }) {
  return (
    <aside className="compagnon-dock-wrapper" aria-label="Accès Compagnon IA">
      <button
        type="button"
        className={`compagnon-dock ${ouvert ? 'actif' : ''}`}
        onClick={onBasculer}
        aria-expanded={ouvert}
        title={ouvert ? 'Fermer le Compagnon IA' : 'Ouvrir le Compagnon IA'}
      >
        <span className="compagnon-dock-icon"><Icon name="ia" size={17} /></span>
        <span className="compagnon-dock-label">{libelle}</span>
        <span className="compagnon-dock-status-dot" />
      </button>
    </aside>
  );
}
