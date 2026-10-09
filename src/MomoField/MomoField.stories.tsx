import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusMomoField } from './MomoField';

const meta = {
  title: 'All Components/MomoField',
  component: SiriusMomoField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div style={{ maxWidth: 640 }}><Story /></div>],
  args: {
    children: (
      <div style={{ padding: '16px 20px', color: 'var(--sirius-text-subdued)' }}>
        Travaille avec Momo
      </div>
    ),
  },
} satisfies Meta<typeof SiriusMomoField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** La carte où Moussa parle à Momo, son compagnon IA. */
export const Defaut: Story = {};
