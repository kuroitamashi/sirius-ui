export type ComponentDoc = {
  slug: string;
  name: string;
  category: 'Actions' | 'Statut' | 'Structure' | 'Formulaires' | 'Donnees';
  summary: string;
  /** Quand s'en servir, en une phrase par ligne. */
  when: string[];
  /** Quand ne pas s'en servir. */
  avoid: string[];
  /** Chemin de l'histoire correspondante dans le Storybook. */
  storybook: string;
};

export const components: ComponentDoc[] = [
  {
    slug: 'button',
    name: 'Button',
    category: 'Actions',
    summary:
      "Declenche une action. Huit variantes, de la plus engageante (primary) a la plus discrete (plain), plus trois variantes destructrices.",
    when: [
      'Enregistrer, publier, supprimer : tout ce qui change quelque chose.',
      'Une seule action primaire par ecran, jamais deux.',
      'Les actions destructrices prennent une variante destructive, jamais primary en rouge fait main.',
    ],
    avoid: [
      "Naviguer vers une autre page : c'est un Link, pas un Button.",
      "Mettre une icone dans un bouton avec du texte. Regle SKS : jamais d'icone dedans.",
    ],
    storybook: 'all-components-button--toutes',
  },
  {
    slug: 'badge',
    name: 'Badge',
    category: 'Statut',
    summary:
      "Affiche un etat en un coup d'oeil. Les tons Wave, Orange Money et especes sont propres a Sen Kheweul Store.",
    when: [
      "Statut d'une commande, d'un produit, d'un abonnement.",
      'Mode de paiement dans une liste de commandes.',
      "Avec kind, le libelle francais est deduit tout seul de l'identifiant technique.",
    ],
    avoid: [
      'Comme bouton. Un Badge ne se clique pas, utiliser ClickableChip.',
      'Pour un compteur. Un Badge dit un etat, pas un nombre.',
    ],
    storybook: 'all-components-badge--paiements',
  },
  {
    slug: 'card',
    name: 'Card',
    category: 'Structure',
    summary:
      'Regroupe un bloc de contenu qui va ensemble, avec un titre, une action et un pied de page optionnels.',
    when: [
      "Decouper une page de reglages ou de fiche produit en sections lisibles.",
      "padded={false} pour coller un tableau bord a bord.",
    ],
    avoid: [
      'Empiler des Card dans des Card. Une seule profondeur.',
      "Une Card pour un seul champ. C'est du bruit.",
    ],
    storybook: 'all-components-card--avec-action',
  },
  {
    slug: 'money-field',
    name: 'MoneyField',
    category: 'Formulaires',
    summary:
      'Champ montant qui formate en FCFA a la saisie : entiers stricts, espace tous les trois chiffres.',
    when: [
      'Tout montant saisi par le marchand : prix, remise, frais de livraison.',
      "La valeur remontee par onChange est un nombre, pas une chaine formatee.",
    ],
    avoid: [
      "Une quantite ou un pourcentage : utiliser NumberField.",
      'Formater un montant en lecture seule : ce champ est fait pour la saisie.',
    ],
    storybook: 'all-components-moneyfield--avec-valeur',
  },
  {
    slug: 'table',
    name: 'Table',
    category: 'Donnees',
    summary:
      'Tableau de donnees avec colonnes typees, rendu personnalise par cellule, pagination et etat vide.',
    when: [
      'Listes de commandes, produits, clientes.',
      'render sur une colonne pour y poser un Badge ou un montant formate.',
      'embedded pour poser le tableau dans une Card en padded={false}.',
    ],
    avoid: [
      "Moins de trois colonnes : une List se lit mieux sur telephone.",
      'Une mise en page. Un tableau sert a comparer des lignes, pas a aligner des blocs.',
    ],
    storybook: 'all-components-table--defaut',
  },
  {
    slug: 'account-connection',
    name: 'AccountConnection',
    category: 'Structure',
    summary:
      "Gère l'état de connexion d'un compte tiers, service partenaire ou passerelle de paiement (ex: Wave, Orange Money).",
    when: [
      'Intégration d’une passerelle de paiement mobile (Wave, Orange Money, PayTech).',
      'Connexion à un service d’expédition ou de notification (SMS, WhatsApp).',
      'Afficher clairement le compte lié, son statut et permettre de connecter ou déconnecter en un clic.',
    ],
    avoid: [
      'Pour une simple connexion utilisateur (login / logout) de la session du marchand.',
      'Si aucune action de configuration externe n’est requise.',
    ],
    storybook: 'all-components-accountconnection--tous-les-cas',
  },
];
