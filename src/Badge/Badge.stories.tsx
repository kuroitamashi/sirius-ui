import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusBadge, type SiriusBadgeProps } from './Badge';

const meta = {
  title: 'All Components/Badge',
  component: SiriusBadge,
  tags: ['autodocs'],
  args: { children: 'Payee' },
} satisfies Meta<typeof SiriusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};

/* Les 15 tons de l'histoire « All » de Polaris, dans le même ordre. */
const TONS: Pick<SiriusBadgeProps, 'tone' | 'variant'>[] = [
  { tone: 'neutral' },
  { tone: 'info' },
  { tone: 'success' },
  { tone: 'warning' },
  { tone: 'attention' },
  { tone: 'critical' },
  { tone: 'new' },
  { tone: 'magic' },
  { tone: 'read-only' },
  { tone: 'enabled' },
  { tone: 'info', variant: 'strong' },
  { tone: 'success', variant: 'strong' },
  { tone: 'warning', variant: 'strong' },
  { tone: 'attention', variant: 'strong' },
  { tone: 'critical', variant: 'strong' },
];

const libelle = (t?: string) =>
  t ? t.charAt(0).toUpperCase() + t.slice(1) : '';

function Rangee(props: Omit<SiriusBadgeProps, 'tone' | 'variant'>) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      {TONS.map((t, i) => (
        <SiriusBadge key={i} {...t} {...props}>
          {libelle(t.tone)}
        </SiriusBadge>
      ))}
    </div>
  );
}

function Taille({ size }: { size: 'medium' | 'large' }) {
  const titre = { margin: '16px 0 8px', fontSize: 13, fontWeight: 650 } as const;
  return (
    <section>
      <h2 style={{ margin: '0 0 8px', fontSize: 24 }}>Taille : {size}</h2>
      <p style={titre}>Ton seul</p>
      <Rangee size={size} />
      <p style={titre}>Ton et progression</p>
      <div style={{ display: 'grid', gap: 8 }}>
        <Rangee size={size} progress="complete" />
        <Rangee size={size} progress="partiallyComplete" />
        <Rangee size={size} progress="incomplete" />
      </div>
      <p style={titre}>Ton et icône</p>
      <Rangee size={size} icon="alert-circle" />
    </section>
  );
}

/** Réplique de l'histoire « All » de Polaris : chaque ton, chaque taille. */
export const Tout: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'grid', gap: 32 }}>
      <Taille size="medium" />
      <Taille size="large" />
    </div>
  ),
};

/**
 * Les tons de paiement sont propres a Sen Kheweul Store : ils n'existent dans
 * aucun design system generique. Awa reconnait le mode de paiement a la
 * couleur, sans lire.
 */
export const Paiements: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <SiriusBadge tone="wave">Wave</SiriusBadge>
      <SiriusBadge tone="orange_money">Orange Money</SiriusBadge>
      <SiriusBadge tone="cash_on_delivery">Especes</SiriusBadge>
    </div>
  ),
};

/**
 * `kind` traduit un identifiant technique en libelle francais tout seul :
 * `kind="payee"` affiche « Payee », `kind="a_traiter"` affiche « A traiter ».
 */
export const LibelleAutomatique: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {['payee', 'en_attente', 'a_traiter', 'expediee', 'livree', 'annulee', 'rupture'].map(
        (k) => (
          <SiriusBadge key={k} kind={k} />
        )
      )}
    </div>
  ),
};

/** Statuts de commande, comme dans la liste des commandes de référence. */
export const AvecProgression: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <SiriusBadge tone="success" progress="complete">
        Livrée
      </SiriusBadge>
      <SiriusBadge tone="warning" progress="partiallyComplete">
        Partiellement expédiée
      </SiriusBadge>
      <SiriusBadge tone="attention" progress="incomplete">
        À traiter
      </SiriusBadge>
    </div>
  ),
};

export const Fort: Story = {
  args: { tone: 'success', variant: 'strong' },
};
