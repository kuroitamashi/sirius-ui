import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusFilters, type SiriusFiltersProps } from './Filters';
import { SiriusChoiceList } from '../Form/ChoiceList';
import { SiriusButton } from '../Button/Button';

// Les filtres de l'écran Produits, avec leurs valeurs.
const CHOIX: Record<string, { label: string; multiple: boolean; choix: string[] }> = {
  statut: { label: 'Statut', multiple: true, choix: ['En ligne', 'Brouillon'] },
  collection: { label: 'Collection', multiple: true, choix: ['Boubous', 'Robes', 'Tissus wax', 'Accessoires'] },
  type: { label: 'Type', multiple: false, choix: ['Physique', 'Numérique'] },
  stock: { label: 'Stock', multiple: true, choix: ['En stock', 'Rupture', 'Non suivi'] },
  avant: { label: 'Mis en avant', multiple: false, choix: ['Oui', 'Non'] },
};

type Options = { epingles?: string[]; desactives?: string[]; depart?: Record<string, string[]> };

/** La barre telle qu'un écran la branche : la recherche et les valeurs cochées vivent chez le parent. */
function Demo({ epingles = [], desactives = [], depart = {}, ...props }: Options & Partial<SiriusFiltersProps>) {
  const [q, setQ] = useState('');
  const [valeurs, setValeurs] = useState<Record<string, string[]>>(depart);
  const retirer = (k: string) => setValeurs(v => { const { [k]: _, ...reste } = v; return reste; });

  return (
    <SiriusFilters
      queryValue={q}
      queryPlaceholder="Rechercher un produit"
      onQueryChange={setQ}
      onQueryClear={() => setQ('')}
      filters={Object.entries(CHOIX).map(([key, f]) => ({
        key,
        label: f.label,
        pinned: epingles.includes(key),
        disabled: desactives.includes(key),
        filter: (
          <SiriusChoiceList
            title={f.label}
            allowMultiple={f.multiple}
            choices={f.choix.map(c => ({ value: c, label: c }))}
            selected={valeurs[key] ?? []}
            onChange={sel => sel.length ? setValeurs(v => ({ ...v, [key]: sel })) : retirer(key)}
          />
        ),
      }))}
      appliedFilters={Object.entries(valeurs).map(([key, sel]) => ({
        key,
        label: `${CHOIX[key].label} : ${sel.join(', ')}`,
        onRemove: retirer,
      }))}
      onClearAll={() => setValeurs({})}
      {...props}
    />
  );
}

const meta = {
  title: 'All Components/Filters',
  component: SiriusFilters,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  // De la place sous la barre pour la liste et les fenêtres.
  decorators: [(Story) => <div style={{ maxWidth: 720, minHeight: 380 }}><Story /></div>],
  args: { filters: [] },
} satisfies Meta<typeof SiriusFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Clique dans le champ : les filtres apparaissent. Flèches pour choisir, Entrée pour ouvrir. */
export const Defaut: Story = { render: () => <Demo /> };

export const AvecFiltresAppliques: Story = {
  render: () => <Demo depart={{ statut: ['En ligne'], collection: ['Boubous', 'Robes'] }} />,
};

/** Une pastille épinglée reste visible, même sans valeur. */
export const AvecFiltresEpingles: Story = { render: () => <Demo epingles={['statut', 'collection']} /> };

/** Du contenu à droite du champ : ici le menu de tri. */
export const AvecContenuADroite: Story = {
  render: () => <Demo><SiriusButton variant="secondary">Trier</SiriusButton></Demo>,
};

export const CertainsDesactives: Story = { render: () => <Demo desactives={['type', 'avant']} epingles={['type']} /> };

export const Desactive: Story = { render: () => <Demo disabled depart={{ statut: ['Brouillon'] }} /> };

export const SansRecherche: Story = { render: () => <Demo hideQueryField epingles={['statut', 'collection', 'stock']} /> };

/** Toutes les options, rangées comme dans l'admin de référence. */
export const Toutes: Story = {
  decorators: [(Story) => <div style={{ maxWidth: 720 }}><Story /></div>],
  render: () => (
    <div style={{ display: 'grid', gap: 32 }}>
      {[
        ['Par défaut', <Demo />],
        ['Filtres appliqués', <Demo depart={{ statut: ['En ligne'], collection: ['Boubous', 'Robes'] }} />],
        ['Épinglés', <Demo epingles={['statut', 'collection']} />],
        ['Contenu à droite', <Demo><SiriusButton variant="secondary">Trier</SiriusButton></Demo>],
        ['Certains désactivés', <Demo desactives={['type']} epingles={['type']} />],
        ['Désactivé', <Demo disabled depart={{ statut: ['Brouillon'] }} />],
        ['Sans recherche', <Demo hideQueryField epingles={['statut', 'collection', 'stock']} />],
      ].map(([titre, demo]) => (
        <section key={titre as string} style={{ display: 'grid', gap: 8 }}>
          <span style={{ fontWeight: 600 }}>{titre}</span>
          {demo}
        </section>
      ))}
    </div>
  ),
};
