import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiriusTextField } from './TextField';
import { TextArea } from './TextArea';
import { SiriusSelect } from './Select';
import { SiriusButton } from '../Button/Button';
import { Icon } from '../Icon/Icon';

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

const grille = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, alignItems: 'start' } as const;

/** Toutes les options, rangées comme dans l'admin de référence. */
export const Toutes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <div style={grille}>
        <SiriusTextField label="Par défaut" defaultValue="Boubou bazin" />
        <SiriusTextField label="Désactivé" defaultValue="Boubou bazin" details="Texte d'aide" disabled />
        <SiriusTextField label="Lecture seule" defaultValue="SKS-1042" readOnly />
      </div>
      <SiriusTextField label="Erreur" defaultValue="Boubou" error="Le titre doit faire au moins 10 caractères." />
      <div style={grille}>
        <SiriusTextField label="Nombre" type="number" defaultValue="5" />
        <SiriusTextField label="Avec action" defaultValue="KORITE10" labelAction={{ content: 'Générer un code' }} />
        <SiriusTextField label="Texte d'exemple" placeholder="Ex. Robe wax" />
      </div>
      <SiriusTextField label="Texte d'aide" defaultValue="Boubou bazin" details="Les clientes le voient sur la vitrine." />
      <div style={grille}>
        <SiriusTextField label="Préfixe" prefix="FCFA" defaultValue="14 900" align="right" />
        <SiriusTextField label="Icône" icon={<Icon name="search" size={20} />} placeholder="Rechercher un produit" />
        <SiriusTextField label="Suffixe" suffix="kg" defaultValue="1,5" />
      </div>
      <SiriusTextField label="Compteur de caractères" defaultValue="Boubou bazin riche brodé main" maxLength={70} showCharacterCount />
      <div style={grille}>
        <SiriusTextField label="Bouton effacer" defaultValue="Fatou Diop" clearButton />
        <SiriusTextField label="Obligatoire" defaultValue="Boubou bazin" required />
        <SiriusTextField label="Chasse fixe" defaultValue="KORITE-2026-A7" monospaced />
      </div>
      <div style={grille}>
        <SiriusTextField label="Chargement" defaultValue="Médina" loading />
        <SiriusTextField label="Texte sélectionné au focus" defaultValue="https://awa-couture.sn" selectTextOnFocus />
        <SiriusTextField label="Aligné à droite" defaultValue="25 000" align="right" />
      </div>
      <SiriusTextField label="Sans contour" defaultValue="Boubou bazin" variant="borderless" />
      <div style={{ ...grille, gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        <TextArea label="Adresse de livraison" defaultValue="Sacré-Cœur 3, villa 214, Dakar" />
        <TextArea label="Zone de texte en erreur" defaultValue="Sacré-Cœur" error="Précise le numéro de la villa." />
      </div>
      <SiriusTextField label="Libellé masqué" labelHidden placeholder="Libellé masqué, lu par les lecteurs d'écran" />
      <SiriusTextField
        label="Champs reliés"
        defaultValue="1,5"
        connectedLeft={<SiriusSelect options={['kg', 'g']} defaultValue="kg" />}
        connectedRight={<SiriusButton>Appliquer</SiriusButton>}
      />
      <div style={grille}>
        <SiriusTextField label="Recherche native" type="search" defaultValue="boubou" />
        <SiriusTextField label="Date native" type="date" />
        <SiriusTextField label="Date et heure natives" type="datetime-local" />
        <SiriusTextField label="Mois natif" type="month" />
        <SiriusTextField label="Heure native" type="time" />
        <SiriusTextField label="Semaine native" type="week" />
      </div>
    </div>
  ),
};
