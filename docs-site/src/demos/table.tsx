import { SiriusTable } from '@sirius/Table/Table';
import { SiriusBadge } from '@sirius/Badge/Badge';

type Commande = {
  numero: string;
  cliente: string;
  paiement: 'wave' | 'orange_money' | 'cash_on_delivery';
  statut: string;
  total: number;
};

const fcfa = (n: number) => `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA`;

const commandes: Commande[] = [
  { numero: '#1042', cliente: 'Awa Diop', paiement: 'wave', statut: 'payee', total: 24000 },
  { numero: '#1043', cliente: 'Modou Fall', paiement: 'orange_money', statut: 'a_traiter', total: 8500 },
  { numero: '#1044', cliente: 'Fatou Sow', paiement: 'cash_on_delivery', statut: 'en_attente', total: 14900 },
];

export default function TableDemo() {
  return (
    <SiriusTable<Commande>
      data={commandes}
      columns={[
        { key: 'numero', title: 'Commande' },
        { key: 'cliente', title: 'Cliente' },
        {
          key: 'paiement',
          title: 'Paiement',
          render: (r) => <SiriusBadge tone={r.paiement} kind={r.paiement} />,
        },
        { key: 'statut', title: 'Statut', render: (r) => <SiriusBadge kind={r.statut} /> },
        { key: 'total', title: 'Total', numeric: true, render: (r) => fcfa(r.total) },
      ]}
    />
  );
}
