import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusDateRangePicker, presetRange, type RangeValue } from './DateRangePicker';

const meta = {
  title: 'All Components/DateRangePicker',
  component: SiriusDateRangePicker,
  tags: ['autodocs'],
  args: { onApply: () => {} },
  decorators: [(Story) => <div style={{ minHeight: 560, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}><Story /></div>],
} satisfies Meta<typeof SiriusDateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function Applique(props: Partial<React.ComponentProps<typeof SiriusDateRangePicker>>) {
  const [range, setRange] = useState<RangeValue>(presetRange(props.initialPreset));
  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <SiriusDateRangePicker {...props} onApply={setRange} />
      <code>{range.from} → {range.to}{range.fromTime ? ` (${range.fromTime} - ${range.toTime})` : ''}</code>
    </div>
  );
}

/** Le sélecteur de l'accueil : clique, choisis un raccourci ou deux jours, puis Appliquer. */
export const Defaut: Story = { render: (args) => <Applique {...args} /> };

/** Bouton en texte nu, panneau aligné à gauche : la version de la bande d'indicateurs. */
export const TexteNu: Story = { args: { variant: 'plain', align: 'left' }, render: (args) => <Applique {...args} /> };

/** Ouvert sur un autre raccourci que les 30 derniers jours. */
export const RaccourciInitial: Story = { args: { initialPreset: 'mois' }, render: (args) => <Applique {...args} /> };

export const Toutes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 48 }}>
      <Applique />
      <Applique variant="plain" align="left" />
      <Applique initialPreset="hier" />
    </div>
  ),
};
