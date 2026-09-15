/**
 * Dictionnaires de traductions par défaut pour Sirius UI
 */

export interface SiriusTranslations {
  Polaris: {
    Common: {
      cancel: string;
      close: string;
      submit: string;
      save: string;
      undo: string;
      clear: string;
    };
    ResourceList: {
      showing: string;
      item: string;
      items: string;
      all: string;
    };
    Pagination: {
      previous: string;
      next: string;
      pagination: string;
    };
    DataTable: {
      sort: string;
      sortedAscending: string;
      sortedDescending: string;
      totals: string;
    };
    [key: string]: any;
  };
  [key: string]: any;
}

export const frTranslations: SiriusTranslations = {
  Polaris: {
    Common: {
      cancel: 'Annuler',
      close: 'Fermer',
      submit: 'Valider',
      save: 'Enregistrer',
      undo: 'Annuler',
      clear: 'Effacer',
    },
    ResourceList: {
      showing: '{count} {resource} affichés',
      item: 'article',
      items: 'articles',
      all: 'Tous',
    },
    Pagination: {
      previous: 'Page précédente',
      next: 'Page suivante',
      pagination: 'Pagination',
    },
    DataTable: {
      sort: 'Trier par',
      sortedAscending: 'Trié par ordre croissant',
      sortedDescending: 'Trié par ordre décroissant',
      totals: 'Totaux',
    },
  },
};

export const enTranslations: SiriusTranslations = {
  Polaris: {
    Common: {
      cancel: 'Cancel',
      close: 'Close',
      submit: 'Submit',
      save: 'Save',
      undo: 'Undo',
      clear: 'Clear',
    },
    ResourceList: {
      showing: 'Showing {count} {resource}',
      item: 'item',
      items: 'items',
      all: 'All',
    },
    Pagination: {
      previous: 'Previous page',
      next: 'Next page',
      pagination: 'Pagination',
    },
    DataTable: {
      sort: 'Sort by',
      sortedAscending: 'Sorted ascending',
      sortedDescending: 'Sorted descending',
      totals: 'Totals',
    },
  },
};
