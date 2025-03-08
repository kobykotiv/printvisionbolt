import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PrintifyProvider } from '../src/providers/printify';
import type { ProductData, ShippingAddress } from '../../api-types/src';

describe('PrintifyProvider', () => {
  let provider: PrintifyProvider;
  const mockCredentials = { apiKey: 'test-api-key', providerId: 'printify' as const };
  
  beforeEach(() => {
    provider = new PrintifyProvider(mockCredentials);
    // Reset fetch mock between tests
    vi.restoreAllMocks();
  });

  it('validates credentials successfully', async () => {
    const mockShops = [{ id: '1', title: 'Test Shop' }];
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockShops),
    });

    await expect(provider.initialize(mockCredentials)).resolves.not.toThrow();
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.printify.com/v1/shops.json',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-api-key'
        })
      })
    );
  });

  it('creates a product successfully', async () => {
    const mockProduct = { id: 'prod_123' };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProduct),
    });

    const productData: ProductData = {
      title: 'Test Product',
      description: 'A test product',
      variants: [
        {
          title: 'Default',
          price: 29.99,
          sku: 'TEST-1',
          options: { size: 'M', color: 'Black' }
        }
      ],
      images: ['https://example.com/test.jpg']
    };

    const productId = await provider.createProduct(productData);
    expect(productId).toBe('prod_123');
  });

  it('gets shipping rates successfully', async () => {
    const mockRates = {
      rates: [
        {
          id: 'rate_1',
          name: 'Standard Shipping',
          price: 5.99,
          currency: 'USD',
          estimated_days: 5
        }
      ]
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRates),
    });

    const address: ShippingAddress = {
      name: 'John Doe',
      address1: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'US',
      zip: '10001'
    };

    const rates = await provider.getShippingRates(address);
    expect(rates).toHaveLength(1);
    expect(rates[0]).toEqual({
      id: 'rate_1',
      name: 'Standard Shipping',
      price: 5.99,
      currency: 'USD',
      estimatedDays: 5
    });
  });
});