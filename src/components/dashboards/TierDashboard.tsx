import { useTierLimits } from '@/hooks/useTierLimits'
import { UsageChart } from '../charts/UsageChart'
import { LimitCard } from '../cards/LimitCard'

export function TierDashboard() {
  const { 
    tier, 
    templateCount,
    templateLimit,
    designUploadsToday,
    designUploadLimit,
    itemsPerTemplate,
    itemsPerTemplateLimit
  } = useTierLimits()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LimitCard
          title="Templates"
          current={templateCount}
          limit={templateLimit}
          href="/templates"
        />
        <LimitCard
          title="Daily Uploads"
          current={designUploadsToday}
          limit={designUploadLimit}
          href="/designs"
        />
        <LimitCard
          title="Items per Template"
          current={itemsPerTemplate}
          limit={itemsPerTemplateLimit}
          href="/templates"
        />
      </div>

      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Usage Trends</h2>
        <UsageChart />
      </div>
    </div>
  )
}
