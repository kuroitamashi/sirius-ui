import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SiriusAppProvider, useSiriusI18n, useSiriusLink } from './AppProvider';
import { enTranslations, frTranslations } from './translations';

const meta: Meta<typeof SiriusAppProvider> = {
  title: 'All Components/AppProvider',
  component: SiriusAppProvider,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Composant racine obligatoire fournissant le contexte global de Sirius UI (traductions i18n, routage SPA via linkComponent, gestion des portails pour modales et popovers).',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SiriusAppProvider>;

// Composant interne simulant une liste de ressources avec libellé dynamique
const DemoResourceList: React.FC<{ items: Array<{ id: string; name: string; location: string }> }> = ({ items }) => {
  const { t } = useSiriusI18n();

  const count = items.length;
  const resource = count === 1 ? t('Polaris.ResourceList.item', {}, 'item') : t('Polaris.ResourceList.items', {}, 'items');
  const headerText = t('Polaris.ResourceList.showing', { count, resource }, `Showing ${count} ${resource}`);

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        border: '1px solid #e1e3e5',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* En-tête de liste */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #e1e3e5',
          fontSize: '13px',
          fontWeight: 400,
          color: '#202223',
        }}
      >
        {headerText}
      </div>

      {/* Éléments de liste */}
      <div>
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="sirius-demo-resource-item"
          >
            {/* Avatar circulaire gris */}
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#c9cccf',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0,
              }}
            >
              <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {/* Infos personne */}
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#202223' }}>{item.name}</div>
              <div style={{ fontSize: '12px', color: '#6d7175' }}>{item.location}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const demoPeople = [
  { id: '1', name: 'Mae Jemison', location: 'Decatur, USA' },
  { id: '2', name: 'Ellen Ochoa', location: 'Los Angeles, USA' },
];

/**
 * 1. Default (Cas 1 de la capture Polaris) :
 * Rendu avec i18n par défaut en anglais affichant « Showing 2 items ».
 */
export const Default: Story = {
  render: () => (
    <SiriusAppProvider i18n={enTranslations}>
      <DemoResourceList items={demoPeople} />
    </SiriusAppProvider>
  ),
};

/**
 * 2. With I 18 N (Cas 2 de la capture Polaris) :
 * Rendu avec i18n français via le dictionnaire frTranslations affichant « 2 articles affichés ».
 */
export const WithI18N: Story = {
  name: 'With I 18 N',
  render: () => (
    <SiriusAppProvider i18n={frTranslations}>
      <DemoResourceList items={demoPeople} />
    </SiriusAppProvider>
  ),
};

// Composant interne pour la démo de navigation via linkComponent
const DemoCustomPage: React.FC = () => {
  const LinkComponent = useSiriusLink();
  const [navMessage, setNavMessage] = useState<string | null>(null);

  const backAction = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      {LinkComponent ? (
        <LinkComponent
          url="/products"
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            setNavMessage('Navigation interceptée avec succès par linkComponent (SPA Router) !');
          }}
          style={{ textDecoration: 'none', color: '#202223', display: 'flex', alignItems: 'center' }}
        >
          <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M17 10a1 1 0 01-1 1H6.414l3.293 3.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L6.414 9H16a1 1 0 011 1z"
              clipRule="evenodd"
            />
          </svg>
        </LinkComponent>
      ) : (
        <a href="/products" style={{ color: '#202223' }}>
          ←
        </a>
      )}
      <h1 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: '#202223' }}>Jar With Lock-Lid</h1>
    </span>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* En-tête de page Polaris */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        {backAction}
        <button
          type="button"
          style={{
            backgroundColor: '#008060',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: '7px 16px',
            fontWeight: 500,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Save
        </button>
      </div>

      {navMessage && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#e3f1df',
            border: '1px solid #7ecc85',
            borderRadius: '6px',
            color: '#1a5928',
            marginBottom: '16px',
            fontSize: '13px',
          }}
        >
          {navMessage}
        </div>
      )}

      <div style={{ padding: '24px', backgroundColor: '#ffffff', border: '1px solid #e1e3e5', borderRadius: '8px' }}>
        <p style={{ margin: 0, color: '#6d7175', fontSize: '13px' }}>Page content</p>
      </div>
    </div>
  );
};

/**
 * 3. With Link Component (Cas 3 de la capture Polaris) :
 * Démontre l'injection d'un composant de lien personnalisé pour gérer la navigation sans rechargement de page.
 */
export const WithLinkComponent: Story = {
  render: () => {
    // Simulation d'un composant de lien Next.js ou React Router
    const CustomLink: React.FC<any> = ({ url, children, onClick, ...props }) => (
      <a href={url} onClick={onClick} {...props} aria-label="Retour aux produits">
        {children}
      </a>
    );

    return (
      <SiriusAppProvider linkComponent={CustomLink}>
        <DemoCustomPage />
      </SiriusAppProvider>
    );
  },
};
