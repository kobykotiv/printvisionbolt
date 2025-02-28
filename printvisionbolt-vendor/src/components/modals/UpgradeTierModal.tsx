import { Dialog } from '@headlessui/react'
import { tiers } from '@/config/tiers'

interface UpgradeTierModalProps {
  isOpen: boolean
  onClose: () => void
  currentTier: string
  feature: string
}

export function UpgradeTierModal({ 
  isOpen, 
  onClose, 
  currentTier, 
  feature 
}: UpgradeTierModalProps) {
  const nextTier = tiers.find(t => t.level > tiers.find(ct => ct.name === currentTier)?.level!)

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md w-full">
          <Dialog.Title className="text-lg font-semibold">
            Upgrade to {nextTier?.name}
          </Dialog.Title>
          
          <div className="mt-4">
            <p>
              You've reached the {feature} limit for your {currentTier} plan.
              Upgrade to {nextTier?.name} to get:
            </p>
            
            <ul className="mt-4 space-y-2">
              {nextTier?.features.map(feature => (
                <li key={feature} className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex gap-4">
            <Button variant="primary" onClick={() => handleUpgrade(nextTier?.name)}>
              Upgrade Now
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Maybe Later
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
