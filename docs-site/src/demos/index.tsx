import ButtonDemo from './button';
import BadgeDemo from './badge';
import CardDemo from './card';
import MoneyFieldDemo from './money-field';
import TableDemo from './table';

const DEMOS: Record<string, () => JSX.Element> = {
  button: ButtonDemo,
  badge: BadgeDemo,
  card: CardDemo,
  'money-field': MoneyFieldDemo,
  table: TableDemo,
};

/**
 * Un seul ilot React pour toutes les demos. Astro n'hydrate qu'un composant
 * importe statiquement : le choix par slug se fait donc ici, cote React, et
 * pas dans le frontmatter de la page.
 */
export default function Demo({ slug }: { slug: string }) {
  const Component = DEMOS[slug];
  if (!Component) return <p>Demo manquante pour « {slug} ».</p>;
  return <Component />;
}
