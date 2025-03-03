import { OrdersTable } from '../../components/orders'
import { DashboardLayout } from '../../components/layouts'
import { GlassHeader } from '@printvisionbolt/shared-ui/components/glass'

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <GlassHeader
        title="Orders"
        actions={[
          {
            label: 'Export',
            href: '#',
            variant: 'secondary'
          }
        ]}
      />
      <OrdersTable />
    </DashboardLayout>
  )
}
