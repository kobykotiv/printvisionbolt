import { Stepper, Button, Group, Card } from '@mantine/core';
import { useState } from 'react';
import { ShopForm } from './ShopForm';
import { AddIntegrationModal } from './AddIntegrationModal';
import type { Shop } from '@/types/models';

interface ShopSetupWizardProps {
  onComplete: (shop: Shop) => void;
  onCancel: () => void;
}

export function ShopSetupWizard({ onComplete, onCancel }: ShopSetupWizardProps) {
  const [active, setActive] = useState(0);
  const [shopData, setShopData] = useState<Partial<Shop>>({});

  const nextStep = () => setActive((current) => current + 1);
  const prevStep = () => setActive((current) => current - 1);

  const handleShopDataSubmit = (data: Partial<Shop>) => {
    setShopData(data);
    nextStep();
  };

  return (
    <Card p="xl" radius="md" withBorder>
      <Stepper active={active} breakpoint="sm" allowNextStepsSelect={false}>
        <Stepper.Step label="Basic Info" description="Shop details">
          <ShopForm onSubmit={handleShopDataSubmit} initialData={shopData} />
        </Stepper.Step>

        <Stepper.Step label="Integration" description="Connect provider">
          <AddIntegrationModal
            opened={true}
            onClose={() => {}}
            shopId=""
            existingProviders={[]}
          />
        </Stepper.Step>

        <Stepper.Completed>
          Completed! Your shop is ready.
        </Stepper.Completed>
      </Stepper>

      <Group position="apart" mt="xl">
        <Button variant="default" onClick={onCancel}>
          Cancel
        </Button>
        <Group>
          {active > 0 && (
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
          )}
          {active < 2 && (
            <Button onClick={nextStep}>
              Next step
            </Button>
          )}
          {active === 2 && (
            <Button onClick={() => onComplete(shopData as Shop)}>
              Finish
            </Button>
          )}
        </Group>
      </Group>
    </Card>
  );
}
