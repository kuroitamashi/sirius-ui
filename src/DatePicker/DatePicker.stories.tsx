import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusDatePicker } from './DatePicker';

const meta = {
  title: 'All Components/DatePicker',
  component: SiriusDatePicker,
  tags: ['autodocs'],
  args: { value: '', onChange: () => {} },
} satisfies Meta<typeof SiriusDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const today = new Date().toISOString().slice(0, 10);

function Choix(props: Partial<React.ComponentProps<typeof SiriusDatePicker>>) {
  const [value, setValue] = useState(props.value ?? '');
  return <SiriusDatePicker {...props} value={value} onChange={setValue} />;
}

/** Une date, choisie d'un clic. */
export const Defaut: Story = { render: (args) => <Choix {...args} /> };

/** Une date de fin de promo : rien avant aujourd'hui. */
export const DatesPasseesDesactivees: Story = { args: { min: today }, render: (args) => <Choix {...args} /> };

/** Une date de naissance ou de commande : rien après aujourd'hui. */
export const DatesFuturesDesactivees: Story = { args: { max: today }, render: (args) => <Choix {...args} /> };

export const Toutes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      <Choix />
      <Choix value={today} min={today} />
      <Choix max={today} />
    </div>
  ),
};
