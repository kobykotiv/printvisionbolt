// Enable this flag to use mock data instead of Supabase
export const TEST_MODE = true;

// Demo account credentials
export const MOCK_USER = {
  id: 'test-user-id',
  email: 'demo@example.com',
  role: 'admin',
  created_at: new Date().toISOString()
};

// Demo token for direct login
export const DEMO_TOKEN = 'demo-access-token-2024';

export const MOCK_SHOPS = [
  {
    id: 'shop-1',
    name: 'Test Shop 1',
    user_id: MOCK_USER.id,
    settings: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'shop-2',
    name: 'Test Shop 2',
    user_id: MOCK_USER.id,
    settings: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const MOCK_BRANDS = [
  {
    id: 'brand-1',
    shop_id: 'shop-1',
    name: 'Summer Vibes',
    description: 'Casual beach wear and summer accessories',
    logo_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200',
    color_scheme: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'brand-2',
    shop_id: 'shop-1',
    name: 'Urban Edge',
    description: 'Street fashion with attitude',
    logo_url: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&q=80&w=200',
    color_scheme: {
      primary: '#2C3E50',
      secondary: '#E74C3C'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Demo designs with realistic data
export const MOCK_DESIGNS = [
  {
    id: 'design-1',
    title: 'Summer Beach Collection',
    description: 'Vibrant beach-themed designs perfect for summer wear',
    thumbnail: 'https://images.unsplash.com/photo-1513346940221-6f673d962e97?auto=format&fit=crop&q=80&w=400',
    tags: ['summer', 'beach', 'vacation'],
    created_at: new Date().toISOString(),
    status: 'active'
  },
  {
    id: 'design-2',
    title: 'Mountain Adventure Series',
    description: 'Rugged outdoor-inspired designs for adventure enthusiasts',
    thumbnail: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=400',
    tags: ['outdoor', 'mountain', 'adventure'],
    created_at: new Date().toISOString(),
    status: 'active'
  }
];

// Demo collections
export const MOCK_COLLECTIONS = [
  {
    id: 'collection-1',
    name: 'Summer 2024',
    description: 'Fresh and vibrant summer collection',
    products: ['product-1', 'product-2'],
    status: 'active',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400',
    created_at: new Date().toISOString()
  },
  {
    id: 'collection-2',
    name: 'Adventure Gear',
    description: 'Outdoor-inspired apparel collection',
    products: ['product-3', 'product-4'],
    status: 'draft',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400',
    created_at: new Date().toISOString()
  }
];
