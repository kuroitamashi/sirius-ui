import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusButton } from './Button';

const meta = {
  title: 'Actions/Button',
  component: SiriusButton,
  tags: ['autodocs'],
  args: { children: 'Enregistrer' },
} satisfies Meta<typeof SiriusButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Defaut: Story = {};

export const Variantes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {(
        [
          'primary',
          'secondary',
          'plain',
          'brand',
          'success',
          'destructive',
          'destructive-outline',
          'destructive-plain',
        ] as const
      ).map((v) => (
        <SiriusButton key={v} {...args} variant={v}>
          {v}
        </SiriusButton>
      ))}
    </div>
  ),
};

export const Tailles: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {(['slim', 'medium', 'large'] as const).map((s) => (
        <SiriusButton key={s} {...args} variant="primary" size={s}>
          {s}
        </SiriusButton>
      ))}
    </div>
  ),
};

export const Etats: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8 }}>
      <SiriusButton {...args} variant="primary" loading>
        Chargement
      </SiriusButton>
      <SiriusButton {...args} variant="primary" disabled>
        Desactive
      </SiriusButton>
      <SiriusButton {...args} variant="primary" fullWidth={false} icon="plus">
        Avec icone
      </SiriusButton>
    </div>
  ),
};

export const PleineLargeur: Story = {
  args: { variant: 'primary', fullWidth: true },
  parameters: { layout: 'padded' },
};
