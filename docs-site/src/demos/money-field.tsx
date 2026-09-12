import { useState } from 'react';
import { SiriusMoneyField } from '@sirius/Form/MoneyField';

export default function MoneyFieldDemo() {
  const [prix, setPrix] = useState(14900);
  return (
    <div style={{ maxWidth: 320 }}>
      <SiriusMoneyField
        label="Prix de vente"
        details="Le prix affiche a la cliente."
        value={prix}
        onChange={setPrix}
      />
      <p style={{ marginTop: 12, fontSize: 12, color: 'var(--sirius-text-subdued)' }}>
        Valeur remontee au code : <code>{prix}</code> (un nombre, pas du texte)
      </p>
    </div>
  );
}
