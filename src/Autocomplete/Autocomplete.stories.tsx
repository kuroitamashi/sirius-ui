import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SiriusAutocomplete, type AutocompleteOption, type AutocompleteSection } from './Autocomplete';

const meta: Meta<typeof SiriusAutocomplete> = {
  title: 'All Components/Autocomplete',
  component: SiriusAutocomplete,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Composant Autocomplete 1:1 conforme au standard Shopify Polaris combinant champ de recherche et popover de suggestions dynamiques.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SiriusAutocomplete>;

const standardTags: AutocompleteOption[] = [
  { value: 'rustic', label: 'Rustic' },
  { value: 'antique', label: 'Antique' },
  { value: 'vinyl', label: 'Vinyl' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'refurbished', label: 'Refurbished' },
];

/**
 * 1. Default (Cas 1 de la capture Shopify Polaris) :
 * Champ de recherche avec label « Tags », icône loupe et suggestions simples.
 */
export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', minHeight: '340px' }}>
        <SiriusAutocomplete
          label="Tags"
          placeholder="Search"
          value={inputValue}
          onChange={setInputValue}
          selected={selected}
          onSelect={setSelected}
          options={standardTags}
        />
      </div>
    );
  },
};

/**
 * 2. With Multiple Tags (Cas 2 de la capture Shopify Polaris) :
 * Sélection multiple avec tags/badges amovibles dans le champ et cases à cocher dans le popover.
 */
export const WithMultipleTags: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['rustic']);
    const [inputValue, setInputValue] = useState('Vintage, cotton, summer');

    const sections: AutocompleteSection[] = [
      {
        title: 'Suggested Tags',
        options: standardTags,
      },
    ];

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', minHeight: '340px' }}>
        <SiriusAutocomplete
          label="Tags"
          placeholder="Search"
          value={inputValue}
          onChange={setInputValue}
          selected={selected}
          onSelect={setSelected}
          sections={sections}
          allowMultiple
        />
      </div>
    );
  },
};

/**
 * 3. With Multiple Sections (Cas 3 de la capture Shopify Polaris) :
 * Groupement des options par sections avec coche ✓ sur l'élément actif (« UPS »).
 */
export const WithMultipleSections: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['ups']);
    const [inputValue, setInputValue] = useState('');

    const carrierSections: AutocompleteSection[] = [
      {
        title: 'Frequently used',
        options: [
          { value: 'ups', label: 'UPS' },
          { value: 'usps', label: 'USPS' },
        ],
      },
      {
        title: 'All carriers',
        options: [
          { value: 'dhl', label: 'DHL Express' },
          { value: 'canada-post', label: 'Canada Post' },
        ],
      },
    ];

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', minHeight: '340px' }}>
        <SiriusAutocomplete
          label="Tags"
          placeholder="Search"
          value={inputValue}
          onChange={setInputValue}
          selected={selected}
          onSelect={setSelected}
          sections={carrierSections}
        />
      </div>
    );
  },
};

/**
 * 4. With Loading (Cas 4 de la capture Shopify Polaris) :
 * Affiche un indicateur de chargement circulaire au centre du popover lors d'une recherche asynchrone.
 */
export const WithLoading: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('Refurbis');

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', minHeight: '260px' }}>
        <SiriusAutocomplete
          label="Tags"
          placeholder="Search"
          value={inputValue}
          onChange={setInputValue}
          selected={selected}
          onSelect={setSelected}
          options={standardTags}
          loading
        />
      </div>
    );
  },
};

/**
 * 5. With Lazy Loading :
 * Simulation d'un chargement asynchrone à la demande lors de la saisie.
 */
export const WithLazyLoading: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (val: string) => {
      setInputValue(val);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    };

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', minHeight: '300px' }}>
        <SiriusAutocomplete
          label="Tags"
          placeholder="Type to trigger lazy load..."
          value={inputValue}
          onChange={handleSearch}
          selected={selected}
          onSelect={setSelected}
          options={standardTags}
          loading={isLoading}
        />
      </div>
    );
  },
};

/**
 * 6. With Empty State :
 * Affiche un message dédié lorsqu'aucun résultat ne correspond à la requête utilisateur.
 */
export const WithEmptyState: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('Nonexistent tag');

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', minHeight: '260px' }}>
        <SiriusAutocomplete
          label="Tags"
          placeholder="Search"
          value={inputValue}
          onChange={setInputValue}
          selected={selected}
          onSelect={setSelected}
          options={standardTags}
          emptyState="No tags found matching your search"
        />
      </div>
    );
  },
};

/**
 * 7. With Action (Cas 6 de la capture Shopify Polaris) :
 * Action en tête de popover avec icône (+), titre, texte d'aide et badge « New! ».
 */
export const WithAction: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');

    const sections: AutocompleteSection[] = [
      {
        title: 'Suggested tags',
        options: standardTags,
      },
    ];

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', minHeight: '380px' }}>
        <SiriusAutocomplete
          label="Tags"
          placeholder="Search"
          value={inputValue}
          onChange={setInputValue}
          selected={selected}
          onSelect={setSelected}
          sections={sections}
          actionBefore={{
            content: 'Action with long name...',
            helpText: 'Help text',
            badge: { content: 'New!' },
            onAction: () => alert('Action déclenchée !'),
          }}
        />
      </div>
    );
  },
};

/**
 * 8. With Wrapping Action :
 * Action en tête avec un texte plus long s'adaptant à la largeur disponible.
 */
export const WithWrappingAction: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');

    const sections: AutocompleteSection[] = [
      {
        title: 'Suggested tags',
        options: standardTags,
      },
    ];

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', minHeight: '380px' }}>
        <SiriusAutocomplete
          label="Tags"
          placeholder="Search"
          value={inputValue}
          onChange={setInputValue}
          selected={selected}
          onSelect={setSelected}
          sections={sections}
          actionBefore={{
            content: 'Créer un nouveau tag personnalisé avec paramètres avancés de catégorisation',
            helpText: 'Ajoute automatiquement ce tag à votre catalogue de produits',
            onAction: () => console.log('Wrapping action clicked'),
          }}
        />
      </div>
    );
  },
};

/**
 * 9. With Destructive Action (Cas 7 de la capture Shopify Polaris) :
 * Action destructive en en-tête sur fond rouge clair (#fdedea) avec icône corbeille rouge (#d72c0d).
 */
export const WithDestructiveAction: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');

    const sections: AutocompleteSection[] = [
      {
        title: 'Suggested tags',
        options: standardTags,
      },
    ];

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', minHeight: '380px' }}>
        <SiriusAutocomplete
          label="Tags"
          placeholder="Search"
          value={inputValue}
          onChange={setInputValue}
          selected={selected}
          onSelect={setSelected}
          sections={sections}
          actionBefore={{
            content: 'Destructive action',
            destructive: true,
            onAction: () => alert('Action destructive exécutée !'),
          }}
        />
      </div>
    );
  },
};
