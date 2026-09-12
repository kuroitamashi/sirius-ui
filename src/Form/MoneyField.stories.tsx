import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusMoneyField } from './MoneyField';

const meta = {
  title: 'Formulaires/MoneyField',
  component: SiriusMoneyField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { label: 'Prix de vente' },
} satisfies Meta<typeof SiriusMoneyField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};

/**
 * Le champ formate en FCFA a la saisie : entiers stricts, espace tous les
 * trois chiffres. Ousmane tape 14900, il lit « 14 900 ».
 */
export const AvecValeur: Story = {
  args: { defaultValue: 14900 },
};

export const AvecAide: Story = {
  args: {
    defaultValue: 24000,
    details: 'Le prix affiche a la cliente, taxes comprises.',
  },
};

export const EnErreur: Story = {
  args: { defaultValue: 0, error: 'Le prix doit etre superieur a 0 FCFA.' },
};

export const Requis: Story = {
  args: { required: true },
};

export const Desactive: Story = {
  args: { defaultValue: 14900, disabled: true },
};

export const AutreDevise: Story = {
  args: { defaultValue: 25, currency: 'EUR', label: 'Prix export' },
};
