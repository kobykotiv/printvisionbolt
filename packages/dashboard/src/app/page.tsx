import { GlassCard } from '@printvisionbolt/shared-ui/components/glass'
import { DashboardLayout } from '../components/layouts'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard
          title="Total Sales"
          value="$0.00"
          trend={0}
          loading={false}
        />
        <GlassCard 
          title="Active Products"
          value="0"
          loading={false}
        />
        <GlassCard
          title="Pending Orders"
          value="0"
          loading={false}
          variant="warning"
        />
      </div>
    </DashboardLayout>
  )
}
