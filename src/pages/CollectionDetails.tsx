import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Edit,
  Eye,
  Package,
  RefreshCw,
  Save,
  Trash2,
  TrendingUp,
  Users
} from 'lucide-react';
import { useShop } from '../contexts/ShopContext';
import { supabase } from '../lib/supabase';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { SortableProduct } from '../components/SortableProduct';

interface CollectionData {
  id: string;
  name: string;
  description: string | null;
  products: string[];
  scheduled_drops: any[];
  status: 'active' | 'draft';
  created_at: string;
  updated_at: string;
}

interface ProductData {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  status: string;
}

interface MetricCard {
  title: string;
  value: string | number;
  change: string;
  icon: React.ComponentType<any>;
}

export function CollectionDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentShop } = useShop();
  const [collection, setCollection] = React.useState<CollectionData | null>(null);
  const [products, setProducts] = React.useState<ProductData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  React.useEffect(() => {
    if (currentShop && id) {
      loadCollection();
    }
  }, [currentShop, id]);

  const loadCollection = async () => {
    try {
      const { data: collectionData, error: collectionError } = await supabase
        .from('collections')
        .select('*')
        .eq('id', id)
        .single();

      if (collectionError) throw collectionError;

      setCollection(collectionData);

      // Load products (in a real app, you'd fetch this from your products table)
      const mockProducts: ProductData[] = Array.from({ length: 6 }, (_, i) => ({
        id: `product-${i + 1}`,
        title: `Product ${i + 1}`,
        thumbnail: i % 2 === 0
          ? 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400'
          : 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400',
        price: 29.99 + i,
        status: i % 3 === 0 ? 'draft' : 'active'
      }));

      setProducts(mockProducts);
    } catch (error) {
      console.error('Error loading collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setProducts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });

      // In a real app, you'd update the order in your database here
      try {
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Update the database with the new order
      } catch (error) {
        console.error('Error saving product order:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  const metrics: MetricCard[] = [
    {
      title: 'Total Views',
      value: '2,847',
      change: '+14.5%',
      icon: Eye
    },
    {
      title: 'Products',
      value: products.length,
      change: '+2.3%',
      icon: Package
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+1.1%',
      icon: TrendingUp
    },
    {
      title: 'Unique Visitors',
      value: '1,425',
      change: '+8.2%',
      icon: Users
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Collection not found</h3>
        <button
          onClick={() => navigate('/collections')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Collections
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/collections')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{collection.name}</h1>
            <p className="text-sm text-gray-500">
              Created on {new Date(collection.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/collections/${id}/edit`)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit className="h-5 w-5 mr-2" />
            Edit
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-red-600 shadow-sm text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50">
            <Trash2 className="h-5 w-5 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className="relative overflow-hidden rounded-lg bg-white p-6 shadow"
            >
              <dt>
                <div className="absolute rounded-md bg-indigo-500 p-3">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {metric.title}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6">
                <p className="text-2xl font-semibold text-gray-900">
                  {metric.value}
                </p>
                <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                  {metric.change}
                </p>
              </dd>
            </div>
          );
        })}
      </div>

      {/* Products Grid */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Products</h2>
          {saving && (
            <div className="flex items-center text-sm text-gray-500">
              <Save className="h-4 w-4 mr-2 animate-spin" />
              Saving changes...
            </div>
          )}
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={products} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <SortableProduct key={product.id} product={product} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}