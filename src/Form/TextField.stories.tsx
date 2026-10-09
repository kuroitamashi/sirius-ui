import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusTextField } from './TextField';

const meta = {
  title: 'All Components/TextField',
  component: SiriusTextField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { label: 'Titre', placeholder: 'T-shirt brodé' },
} satisfies Meta<typeof SiriusTextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};
export const AvecValeur: Story = { args: { defaultValue: 'Boubou bazin riche' } };
export const EnErreur: Story = { args: { error: 'Le titre est obligatoire' } };
export const Desactive: Story = { args: { disabled: true, defaultValue: 'Boubou bazin riche' } };
