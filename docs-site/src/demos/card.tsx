import { SiriusCard } from '@sirius/Card/Card';
import { SiriusButton } from '@sirius/Button/Button';

export default function CardDemo() {
  return (
    <SiriusCard
      title="Informations produit"
      subtitle="Derniere modification il y a 3 minutes"
      action={<SiriusButton variant="plain">Modifier</SiriusButton>}
    >
      Masque LED, 14 900 FCFA, 12 en stock.
    </SiriusCard>
  );
}
