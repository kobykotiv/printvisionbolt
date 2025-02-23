import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { BlueprintSearchModal } from '../components/templates/BlueprintSearchModal';

const Blueprints: React.FC = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const categories = [
    { id: 'all', name: 'All Blueprints' },
    { id: 'recent', name: 'Recently Used' },
    { id: 'trending', name: 'Trending' },
    { id: 'custom', name: 'Custom' }
  ];

  const blueprintsList = [
    {
      id: 1,
      name: 'T-Shirt Basic Layout',
      category: 'Apparel',
      usageCount: 245,
      lastUsed: '2 days ago'
    },
    {
      id: 2,
      name: 'Mug Design Template',
      category: 'Drinkware',
      usageCount: 189,
      lastUsed: '5 days ago'
    },
    {
      id: 3,
      name: 'Phone Case Pattern',
      category: 'Accessories',
      usageCount: 156,
      lastUsed: '1 week ago'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Design Blueprints</h1>
            <p className="text-gray-600 mt-2">
              Create and manage reusable design templates for your products
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              <Search className="h-5 w-5 text-gray-400" />
              <span>Search</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              <Plus className="h-5 w-5" />
              <span>New Blueprint</span>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex space-x-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-gray-600">Filter by:</span>
          </div>
          <select className="form-select rounded-lg border-gray-300">
            <option>All Categories</option>
            <option>Apparel</option>
            <option>Drinkware</option>
            <option>Accessories</option>
          </select>
          <select className="form-select rounded-lg border-gray-300">
            <option>Most Used</option>
            <option>Recently Added</option>
            <option>Alphabetical</option>
          </select>
        </div>

        {/* Blueprints Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blueprintsList.map((blueprint) => (
            <div
              key={blueprint.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                {/* Blueprint Preview */}
                <div className="flex items-center justify-center text-gray-400">
                  Preview
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {blueprint.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {blueprint.category}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-600">
                    Used {blueprint.usageCount} times
                  </span>
                  <span className="text-sm text-gray-500">
                    {blueprint.lastUsed}
                  </span>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    Use
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search Modal */}
        <BlueprintSearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Blueprints;