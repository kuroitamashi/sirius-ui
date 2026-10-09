import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusSelect } from './Select';

const meta = {
  title: 'All Components/Select',
  component: SiriusSelect,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { label: 'Statut', options: ['Actif', 'Brouillon'], defaultValue: 'Actif' },
} satisfies Meta<typeof SiriusSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};
export const EnErreur: Story = { args: { error: 'Choisis un statut' } };
export const Desactive: Story = { args: { disabled: true } };

const regions = ['Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor'];
const grille = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, alignItems: 'start' } as const;

/** Toutes les options, rangées comme dans l'admin de référence. */
export const Toutes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <div style={grille}>
        <SiriusSelect label="Par défaut" options={regions} defaultValue="Dakar" />
        <SiriusSelect label="Désactivé" options={regions} defaultValue="Dakar" details="Texte d'aide" disabled />
        <SiriusSelect label="Erreur" options={regions} defaultValue="Dakar" error="La région est obligatoire" />
      </div>
      <div style={grille}>
        <SiriusSelect label="Obligatoire" options={regions} defaultValue="Dakar" required />
        <SiriusSelect label="Texte d'exemple" options={regions} placeholder="Choisis une région" defaultValue="" />
        <SiriusSelect label="Avec action" options={regions} defaultValue="Dakar" labelAction={{ content: 'Gérer les zones' }} />
        <SiriusSelect label="Texte d'aide" options={regions} defaultValue="Dakar" details="Sert au calcul de la livraison." />
      </div>
      <SiriusSelect label="Texte long" options={['Livraison express le jour même à Dakar, Pikine, Guédiawaye et Rufisque, avant 18 h']} />
      <div style={grille}>
        <SiriusSelect label="Trier par" labelInline options={['Date', 'Montant', 'Cliente']} defaultValue="Date" />
        <SiriusSelect label="Libellé masqué" labelHidden options={regions} defaultValue="Thiès" />
      </div>
    </div>
  ),
};
