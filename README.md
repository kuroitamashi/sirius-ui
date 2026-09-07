# Sirius UI

> Modern, robust, and accessible Design System for React and Next.js applications.

Sirius UI provides a comprehensive set of accessible, high-performance UI components, tactile interaction states, form inputs with currency formatting, and an extensive collection of 499 vector icons.

## Installation

```bash
npm install github:kuroitamashi/sirius-ui
```

*(Or via npm once published: `npm install @kuroitamashi/sirius-ui`)*

## Quick Start

Import the global styles in your application root (e.g. `layout.tsx` or `_app.tsx`):

```tsx
import '@kuroitamashi/sirius-ui/styles.css';
```

Then import and use components anywhere in your project:

```tsx
import React from 'react';
import {
  SiriusButton,
  SiriusModal,
  SiriusCard,
  SiriusTable,
  SiriusPageHeader,
  SiriusTooltip,
  Icon,
} from '@kuroitamashi/sirius-ui';

export function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <SiriusPageHeader
        icon="tag"
        breadcrumbs={[{ label: 'Orders', url: '#' }]}
        title="Order #1042"
        subtitle="Updated just now"
      />

      <SiriusButton variant="primary" onClick={() => setOpen(true)}>
        Open Modal
      </SiriusButton>

      <SiriusModal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm Action"
        primaryAction={{ content: 'Confirm', onAction: () => setOpen(false) }}
      >
        <p>Are you sure you want to proceed?</p>
      </SiriusModal>
    </div>
  );
}
```

## Included Components

- **Actions**: `SiriusButton`, `SiriusButtonGroup`, `SiriusClickableChip`, `SiriusLink`, `SiriusMenu`
- **Structure & Layout**: `SiriusCard`, `SiriusDivider`, `SiriusTable`, `SiriusPageHeader`, `SiriusList`
- **Feedback & Overlays**: `SiriusModal`, `SiriusTooltip`, `SiriusBanner`, `SiriusSpinner`, `SiriusProgressBar`, `SiriusBadge`
- **Forms**: `TextField`, `MoneyField`, `NumberField`, `Select`, `Checkbox`, `ChoiceList`, `Switch`, `DatePicker`, `ColorPicker`, `DropArea`
- **Icons**: `Icon` component with 499 optimized vector glyphs.

## License

MIT © Kuroitamashi
