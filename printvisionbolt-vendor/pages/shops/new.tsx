import { Container } from '@mantine/core';
import { useRouter } from 'next/router';
import { ShopSetupWizard } from '@/components/shops/ShopSetupWizard';
import { ShopsAPI } from '@/lib/api/shops';
import type { Shop } from '@/types/models';

export default function NewShopPage() {
  const router = useRouter();

  const handleComplete = async (shopData: Shop) => {
    await ShopsAPI.create(shopData);
    router.push('/shops');
  };

  const handleCancel = () => {
    router.push('/shops');
  };

  return (
    <Container size="md">
      <ShopSetupWizard
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </Container>
  );
}
