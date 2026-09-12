import { SiriusBadge } from '@sirius/Badge/Badge';

export default function BadgeDemo() {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <SiriusBadge tone="wave">Wave</SiriusBadge>
      <SiriusBadge tone="orange_money">Orange Money</SiriusBadge>
      <SiriusBadge tone="cash_on_delivery">Especes</SiriusBadge>
      <SiriusBadge kind="payee" pip="filled" />
      <SiriusBadge kind="a_traiter" pip="hollow" />
    </div>
  );
}
