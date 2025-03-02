import { ProductsTable } from '../../components/products'
import { DashboardLayout } from '../../components/layouts'
import { GlassHeader } from '@printvisionbolt/shared-ui/components/glass'

export default function ProductsPage() {
  return (
    <DashboardLayout>
      <GlassHeader
        title="Products"
        actions={[
          {
            label: 'Add Product',
            href: '/products/new',
            variant: 'primary'
          },
          {
            label: 'Bulk Upload',
            href: '/products/bulk',
            variant: 'secondary'
          }
        ]}
      />
      <ProductsTable />
    </DashboardLayout>
  )
}
