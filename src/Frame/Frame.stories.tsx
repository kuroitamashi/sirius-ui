import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import './app.css';
import { SiriusFrame, useSiriusFrame } from './Frame';
import { SiriusSidebar, type SiriusNavSection, type SiriusNavItem } from './Sidebar';
import { SiriusModal } from '../Modal/Modal';
import { SiriusButton } from '../Button/Button';
// @ts-expect-error : import d'image résolu par Vite, sans déclaration de type ici
import logo from '../../.storybook/assets/sks-icon.png';

const BRAND = { src: logo as string, alt: 'Sen Kheweul Store', href: '/' };

const MARCHAND: SiriusNavSection[] = [{
  items: [
    { label: 'Accueil', icon: 'dashboard', href: '/', exact: true },
    {
      label: 'Produits', icon: 'produits', children: [
        { label: 'Tous les produits', href: '/produits' },
        { label: 'Collections', href: '/produits/collections' },
        { label: 'Avis' },
        { label: 'Inventaire' },
      ],
    },
    { label: 'Commandes', icon: 'commandes', href: '/commandes', badge: 3 },
    { label: 'Clients', icon: 'clients', href: '/clients' },
    { label: 'Code promo', icon: 'promotions', href: '/promotions' },
    { label: 'Thèmes vitrine', icon: 'templates', href: '/themes' },
  ],
}];

const CONSOLE: SiriusNavSection[] = [
  { items: [{ label: 'Accueil', icon: 'dashboard', href: '/admin', exact: true }] },
  {
    title: 'Plateforme',
    items: [
      { label: 'Boutiques', icon: 'boutiques', href: '/admin/boutiques' },
      { label: 'Utilisateurs', icon: 'utilisateurs', href: '/admin/utilisateurs' },
      { label: 'Facturation & MRR', icon: 'abonnement', href: '/admin/facturation' },
      { label: 'CRM Prospection', icon: 'growth', href: '/admin/crm' },
      {
        label: 'Contenu', icon: 'contenu', children: [
          { label: 'Idées & rédaction', href: '/admin/contenu' },
          { label: 'Calendrier', href: '/admin/contenu/calendrier' },
        ],
      },
      { label: 'Journal', icon: 'file-list', href: '/admin/journal' },
    ],
  },
];

const PARAMETRES: SiriusNavItem = { label: 'Paramètres', icon: 'reglages', href: '/reglages' };

/** Le panneau du compagnon tel que l'application le remplit ; la croix passe par le cadre. */
function ContenuCompagnon() {
  const frame = useSiriusFrame();
  return (
    <>
      <header className="compagnon-tete">
        <span className="compagnon-titre">Compagnon IA</span>
        <span className="compagnon-badge">Bientôt</span>
        <SiriusButton variant="plain" iconOnly icon="x" className="compagnon-fermer"
          ariaLabel="Fermer le compagnon" onClick={() => frame?.onCompagnon()} />
      </header>
      <div className="compagnon-corps">
        <h2 className="compagnon-accroche">Le compagnon arrive bientôt</h2>
        <p className="compagnon-texte">Pose-lui des questions sur ta boutique.</p>
      </div>
    </>
  );
}

// Un lien qui ne quitte pas l'histoire : il change seulement la page courante.
function demo(sections: SiriusNavSection[], depart: string, railImpose = false) {
  return function Demo() {
    const [pathname, setPathname] = useState(depart);
    // Mémorisé : un composant recréé à chaque rendu remonterait tous les liens.
    const Lien = useMemo(() => function Lien({ href, onClick, ...p }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
      return <a {...p} href={href} onClick={e => { e.preventDefault(); onClick?.(e); if (href) setPathname(href); }} />;
    }, []);
    return (
      <SiriusFrame
        pathname={pathname}
        railImpose={railImpose}
        railSortieHref="/"
        compagnon={<ContenuCompagnon />}
        search={({ open, onClose }) => (
          <SiriusModal open={open} onClose={onClose} title="Rechercher">
            <p>La recherche de l&apos;application s&apos;ouvre ici (Ctrl+K).</p>
          </SiriusModal>
        )}
        sidebar={
          <SiriusSidebar
            pathname={pathname}
            sections={sections}
            brand={BRAND}
            footerItem={PARAMETRES}
            linkComponent={Lien}
            menu={
              // Le déclencheur du menu boutique de l'application, balisage compris.
              <div className="shop-menu">
                <button className="shop-menu-trigger" aria-label="Boutique d'Awa">
                  <span className="shop-menu-mark">AW</span>
                  <span className="shop-menu-label">Boutique d&apos;Awa</span>
                </button>
              </div>
            }
          />
        }
      >
        <div className="page">
          <h1>{pathname}</h1>
          <p>Ctrl+B replie la barre en rail, Ctrl+K ouvre la recherche, Échap ferme.</p>
          <div style={{ height: 1600 }} />
        </div>
      </SiriusFrame>
    );
  };
}

const meta = {
  title: 'All Components/Frame',
  component: SiriusFrame,
  parameters: { layout: 'fullscreen' },
  args: { sidebar: null, children: null, pathname: '/' },
} satisfies Meta<typeof SiriusFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Marchand: Story = { render: demo(MARCHAND, '/produits') };
export const Console: Story = { render: demo(CONSOLE, '/admin/boutiques') };
/** Mode réglages : rail imposé, le logo ramène à l'accueil. */
export const RailImpose: Story = { render: demo(MARCHAND, '/reglages', true) };
