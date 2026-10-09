import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SiriusCheckbox } from './Checkbox';
import { SiriusRadio } from './Radio';

const meta = {
  title: 'All Components/Checkbox',
  component: SiriusCheckbox,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { label: 'Prévenir le groupe WhatsApp' },
} satisfies Meta<typeof SiriusCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {
  render: (args) => {
    const [on, setOn] = useState(false);
    return <SiriusCheckbox {...args} checked={on} onChange={setOn} />;
  },
};

const col = { display: 'grid', gap: 12, alignContent: 'start' } as const;

/** Tous les états de la case et du bouton radio, comme dans l'admin de référence. */
export const Toutes: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
      <div style={col}>
        <SiriusCheckbox label="Non cochée" />
        <SiriusCheckbox label="Cochée" checked />
        <SiriusCheckbox label="En partie (indéterminée)" checked="indeterminate" />
        <SiriusCheckbox label="Avec aide" details="La cliente recevra le suivi sur son espace." />
        <SiriusCheckbox label="En erreur" error="Accepte les conditions pour continuer." />
      </div>
      <div style={col}>
        <SiriusCheckbox label="Désactivée" disabled />
        <SiriusCheckbox label="Désactivée cochée" checked disabled />
        <SiriusCheckbox label="Désactivée en partie" checked="indeterminate" disabled />
        <SiriusCheckbox label="Libellé masqué" labelHidden />
      </div>
      <div style={col}>
        <SiriusRadio name="livraison" label="Livraison à Dakar" checked />
        <SiriusRadio name="livraison" label="Retrait en boutique" details="Sacré-Cœur 3, de 9 h à 19 h." />
        <SiriusRadio name="d" label="Désactivé" disabled />
        <SiriusRadio name="d2" label="Désactivé choisi" checked disabled />
      </div>
    </div>
  ),
};
