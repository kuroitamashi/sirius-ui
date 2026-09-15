import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusButton, type SiriusButtonProps } from './Button';
import { Icon } from '../Icon/Icon';

const meta = {
  title: 'All Components/Button',
  component: SiriusButton,
  tags: ['autodocs'],
  args: { children: 'Label' },
} satisfies Meta<typeof SiriusButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = [
  ['secondary', 'Par defaut'],
  ['primary', 'Primaire'],
  ['brand', 'Marque'],
  ['success', 'Succes'],
  ['plain', 'Nu'],
  ['destructive', 'Destructeur'],
  ['destructive-outline', 'Destructeur contour'],
  ['destructive-plain', 'Destructeur nu'],
] as const;

const isDestructive = (v: string) => v.startsWith('destructive');

/** Une ligne de la matrice : les quatre etats d'une meme variante. */
function Row({ variant }: { variant: SiriusButtonProps['variant'] }) {
  const icone = isDestructive(variant!) ? 'croix' : 'commandes';
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <SiriusButton variant={variant}>Label</SiriusButton>
      <SiriusButton variant={variant} disabled>Label</SiriusButton>
      <SiriusButton
        variant={variant}
        iconOnly
        ariaLabel={isDestructive(variant!) ? 'Supprimer' : 'Voir la commande'}
        icon={<Icon name={icone} size={15} />}
      />
      <SiriusButton
        variant={variant}
        iconOnly
        disabled
        ariaLabel={isDestructive(variant!) ? 'Supprimer' : 'Voir la commande'}
        icon={<Icon name={icone} size={15} />}
      />
      <SiriusButton variant={variant} loading>Label</SiriusButton>
    </div>
  );
}

/**
 * Toutes les variantes et tous leurs etats sur un seul ecran. Colonnes, dans
 * l'ordre : normal, desactive, icone seule, icone seule desactivee, en cours.
 *
 * Sers-t'en pour verifier une modification de `button.css` d'un coup d'oeil,
 * plutot que d'ouvrir huit histoires les unes apres les autres.
 */
export const Toutes: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      {VARIANTS.map(([v, label]) => (
        <div key={v}>
          <p
            style={{
              margin: '0 0 8px',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--sirius-text-subdued)',
            }}
          >
            {label} <code style={{ fontWeight: 400 }}>{v}</code>
          </p>
          <Row variant={v} />
        </div>
      ))}
    </div>
  ),
};

export const ParDefaut: Story = { args: { variant: 'secondary' } };
export const Primaire: Story = { args: { variant: 'primary' } };
export const Marque: Story = { args: { variant: 'brand' } };
export const Succes: Story = { args: { variant: 'success' } };
export const Nu: Story = { args: { variant: 'plain' } };
export const Destructeur: Story = { args: { variant: 'destructive' } };
export const DestructeurContour: Story = { args: { variant: 'destructive-outline' } };
export const DestructeurNu: Story = { args: { variant: 'destructive-plain' } };

export const Tailles: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {(['slim', 'medium', 'large'] as const).map((s) => (
        <SiriusButton key={s} variant="primary" size={s}>
          {s}
        </SiriusButton>
      ))}
    </div>
  ),
};

export const IconeSeule: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <SiriusButton variant="secondary" iconOnly ariaLabel="Ajouter" icon="plus" />
      <SiriusButton variant="secondary" iconOnly ariaLabel="Modifier" icon="edit" />
      <SiriusButton variant="destructive-outline" iconOnly ariaLabel="Supprimer" icon="delete" />
      <SiriusButton variant="plain" iconOnly ariaLabel="Fermer" icon="croix" />
    </div>
  ),
};

/**
 * Boutons associant une icône Sirius et un libellé textuel (standard Shopify Polaris).
 */
export const AvecIconeEtTexte: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <SiriusButton variant="primary" icon="plus">
        Ajouter un produit
      </SiriusButton>
      <SiriusButton variant="secondary" icon="import">
        Importer CSV
      </SiriusButton>
      <SiriusButton variant="secondary" icon="export">
        Exporter
      </SiriusButton>
      <SiriusButton variant="destructive-outline" icon="delete">
        Supprimer
      </SiriusButton>
    </div>
  ),
};

/**
 * Boutons avec chevron disclosure pour les déclencheurs de menus et listes d'actions.
 */
export const MenuDeroulantDisclosure: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <SiriusButton variant="secondary" disclosure>
        Plus d'actions
      </SiriusButton>
      <SiriusButton variant="plain" disclosure>
        Filtrer par statut
      </SiriusButton>
      <SiriusButton variant="primary" disclosure>
        Actions groupées
      </SiriusButton>
    </div>
  ),
};

export const EtatDesactive: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      {(['primary', 'secondary', 'plain', 'destructive'] as const).map((v) => (
        <SiriusButton key={v} variant={v} disabled>
          {v}
        </SiriusButton>
      ))}
    </div>
  ),
};

export const EtatChargement: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      {(['primary', 'secondary', 'destructive'] as const).map((v) => (
        <SiriusButton key={v} variant={v} loading>
          Enregistrement
        </SiriusButton>
      ))}
    </div>
  ),
};

export const PleineLargeur: Story = {
  args: { variant: 'primary', fullWidth: true, children: 'Publier la boutique' },
  parameters: { layout: 'padded' },
};

/** Avec `href`, le bouton se rend en `<a>`. `external` ajoute la cible et le rel. */
export const Lien: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <SiriusButton variant="secondary" href="#produits">Voir les produits</SiriusButton>
      <SiriusButton variant="plain" href="https://senkheweulstore.com" external>
        Ouvrir la vitrine
      </SiriusButton>
    </div>
  ),
};
