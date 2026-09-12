import { SiriusButton } from '@sirius/Button/Button';

export default function ButtonDemo() {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <SiriusButton variant="primary">Enregistrer</SiriusButton>
      <SiriusButton variant="secondary">Annuler</SiriusButton>
      <SiriusButton variant="plain">Modifier</SiriusButton>
      <SiriusButton variant="destructive">Supprimer</SiriusButton>
    </div>
  );
}
