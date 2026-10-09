import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusSwitch } from './Switch';

const meta = {
  title: 'All Components/Switch',
  component: SiriusSwitch,
  tags: ['autodocs'],
  args: { label: 'Afficher la sélection' },
} satisfies Meta<typeof SiriusSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Clique pour voir le pouce glisser. */
export const Defaut: Story = {
  render: (args) => {
    const [on, setOn] = useState(false);
    return <SiriusSwitch {...args} checked={on} onChange={setOn} />;
  },
};

export const Etats: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <SiriusSwitch label="Désactivé" checked={false} />
      <SiriusSwitch label="Activé" checked />
      <SiriusSwitch label="Inactif, désactivé" checked={false} disabled />
      <SiriusSwitch label="Inactif, activé" checked disabled />
    </div>
  ),
};
