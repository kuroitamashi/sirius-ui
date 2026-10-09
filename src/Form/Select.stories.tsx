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
